// @ts-nocheck
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { analyzeJobDescription } from "@/lib/ai/job-analysis"
import { rankExperiences } from "@/lib/ai/experience-ranking"
import { tailorHighlight } from "@/lib/ai/highlight-tailoring"
import { generateLatexResume } from "@/lib/ai/latex-generator"
import { generateCoverLetter } from "@/lib/ai/cover-letter"

export const maxDuration = 300 // 5 minutes for Vercel

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { jobTitle, companyName, jobDescription } = body

    if (!jobTitle || !companyName || !jobDescription) {
      return NextResponse.json(
        { error: "Job title, company name, and job description are required" },
        { status: 400 }
      )
    }

    // Step 1: Get user profile and experiences
    const [profile, experiences, user] = await Promise.all([
      prisma.userProfile.findUnique({
        where: { userId: session.user.id },
      }),
      prisma.experience.findMany({
        where: { userId: session.user.id },
        include: { highlights: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true },
      }),
    ])

    if (!profile || !user) {
      return NextResponse.json(
        { error: "Please complete your profile first" },
        { status: 400 }
      )
    }

    if (experiences.length === 0) {
      return NextResponse.json(
        { error: "Please add at least one experience first" },
        { status: 400 }
      )
    }

    // Step 2: Analyze job description
    const jobAnalysis = await analyzeJobDescription(
      jobDescription,
      jobTitle,
      companyName
    )

    // Step 3: Rank experiences
    const rankedExperiences = await rankExperiences(experiences, jobAnalysis)

    // Step 4: Tailor highlights
    const tailoredExperiences = await Promise.all(
      rankedExperiences.slice(0, 5).map(async (rankedExp) => {
        const experience = experiences.find(e => e.id === rankedExp.experienceId)
        if (!experience) return null

        const selectedHighlights = rankedExp.selectedHighlights.map(sh => {
          return experience.highlights.find(h => h.id === sh.highlightId)
        }).filter(Boolean)

        const tailoredHighlights = await Promise.all(
          selectedHighlights.map(highlight =>
            tailorHighlight(
              highlight!.content,
              experience.title,
              experience.organization,
              jobAnalysis
            )
          )
        )

        return {
          ...experience,
          tailoredHighlights,
          relevanceScore: rankedExp.relevanceScore,
        }
      })
    )

    const validExperiences = tailoredExperiences.filter(e => e !== null)

    // Step 5: Extract all skills from selected experiences and prioritize
    const allSkills = new Set<string>()
    validExperiences.forEach(exp => {
      exp?.skills?.forEach((skill: string) => allSkills.add(skill))
    })

    const prioritizedSkills = Array.from(allSkills).slice(0, 20)

    // Step 6: Generate LaTeX resume
    const resumeData = {
      profile: {
        name: user.name || "",
        email: user.email,
        phone: profile.phone,
        location: profile.location,
        linkedinUrl: profile.linkedinUrl,
        githubUrl: profile.githubUrl,
        portfolioUrl: profile.portfolioUrl,
        summary: profile.summary,
      },
      experiences: validExperiences.map(exp => ({
        type: exp!.type,
        title: exp!.title,
        organization: exp!.organization,
        location: exp!.location,
        startDate: exp!.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        endDate: exp!.endDate
          ? exp!.endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : undefined,
        isCurrentRole: exp!.isCurrentRole,
        tailoredHighlights: exp!.tailoredHighlights,
      })),
      skills: prioritizedSkills,
    }

    const latexCode = await generateLatexResume(resumeData, jobAnalysis)

    // Step 7: Generate cover letter
    const topAchievements = validExperiences
      .slice(0, 3)
      .flatMap(exp => exp!.tailoredHighlights.slice(0, 1))

    const coverLetter = await generateCoverLetter(
      {
        userName: user.name || "",
        userEmail: user.email,
        userPhone: profile.phone,
        userLocation: profile.location,
        headline: profile.headline,
        summary: profile.summary,
        topAchievements,
        companyName,
        jobTitle,
      },
      jobAnalysis
    )

    // Step 8: Save resume to database
    const savedResume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        jobTitle,
        companyName,
        jobDescription,
        analysisResult: jobAnalysis as any,
        selectedExpIds: validExperiences.map(e => e!.id),
        tailoredContent: {
          experiences: validExperiences.map(e => ({
            id: e!.id,
            title: e!.title,
            organization: e!.organization,
            tailoredHighlights: e!.tailoredHighlights,
            relevanceScore: e!.relevanceScore,
          })),
        } as any,
        latexCode,
        coverLetter,
      },
    })

    return NextResponse.json({
      resume: savedResume,
      jobAnalysis,
      rankedExperiences: validExperiences.map(e => ({
        id: e!.id,
        title: e!.title,
        organization: e!.organization,
        relevanceScore: e!.relevanceScore,
      })),
    }, { status: 201 })

  } catch (error: any) {
    console.error("Resume generation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate resume" },
      { status: 500 }
    )
  }
}
