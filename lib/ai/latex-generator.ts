import { generateWithGemini } from "../gemini"
import { JobAnalysisResult } from "./job-analysis"

export interface ResumeData {
  profile: {
    name: string
    email: string
    phone?: string
    location?: string
    linkedinUrl?: string
    githubUrl?: string
    portfolioUrl?: string
    summary?: string
  }
  experiences: Array<{
    type: string
    title: string
    organization: string
    location?: string
    startDate: string
    endDate?: string
    isCurrentRole: boolean
    tailoredHighlights: string[]
  }>
  skills: string[]
}

export async function generateLatexResume(
  resumeData: ResumeData,
  jobAnalysis: JobAnalysisResult
): Promise<string> {
  const prompt = `Generate a complete, ATS-optimized LaTeX resume based on the following data.

REQUIREMENTS:
1. Use a clean, professional template (ATS-friendly: no tables, columns, or graphics)
2. Include: header with contact info, professional summary, experience section, skills section
3. Format dates consistently (e.g., "Jan 2020 - Present")
4. Use bullet points for highlights
5. Skills should be prioritized based on job requirements
6. The resume should compile without errors

Profile:
Name: ${resumeData.profile.name}
Email: ${resumeData.profile.email}
Phone: ${resumeData.profile.phone || ""}
Location: ${resumeData.profile.location || ""}
LinkedIn: ${resumeData.profile.linkedinUrl || ""}
GitHub: ${resumeData.profile.githubUrl || ""}
Portfolio: ${resumeData.profile.portfolioUrl || ""}
Summary: ${resumeData.profile.summary || ""}

Experiences:
${JSON.stringify(resumeData.experiences, null, 2)}

Skills (prioritized for this role):
${resumeData.skills.join(", ")}

Job Requirements Context:
${JSON.stringify(jobAnalysis, null, 2)}

Generate a COMPLETE LaTeX document (.tex file) that:
- Starts with \\documentclass{article}
- Includes all necessary packages
- Has a professional, ATS-friendly layout
- Emphasizes relevant skills and experiences for this role
- Fits on 1-2 pages

Return ONLY the LaTeX code, no markdown formatting or explanation.`

  try {
    const latex = await generateWithGemini(prompt)
    // Clean up any markdown code blocks if present
    return latex.replace(/```latex\n?/g, '').replace(/```\n?/g, '').trim()
  } catch (error) {
    console.error("LaTeX generation error:", error)
    throw new Error("Failed to generate LaTeX resume")
  }
}
