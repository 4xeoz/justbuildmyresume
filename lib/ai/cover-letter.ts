import { generateWithGemini } from "../gemini"
import { JobAnalysisResult } from "./job-analysis"

export interface CoverLetterData {
  userName: string
  userEmail: string
  userPhone?: string
  userLocation?: string
  headline?: string
  summary?: string
  topAchievements: string[]
  companyName: string
  jobTitle: string
  hiringManagerName?: string
}

export async function generateCoverLetter(
  data: CoverLetterData,
  jobAnalysis: JobAnalysisResult
): Promise<string> {
  const prompt = `Generate a personalized, professional cover letter for a job application.

Applicant Information:
Name: ${data.userName}
Email: ${data.userEmail}
Phone: ${data.userPhone || ""}
Location: ${data.userLocation || ""}
Professional Headline: ${data.headline || ""}
Summary: ${data.summary || ""}

Job Information:
Company: ${data.companyName}
Position: ${data.jobTitle}
${data.hiringManagerName ? `Hiring Manager: ${data.hiringManagerName}` : ""}

Job Requirements:
${JSON.stringify(jobAnalysis, null, 2)}

Top 3 Relevant Achievements:
${data.topAchievements.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Cultural Signals from Job Posting:
${jobAnalysis.culturalSignals.join(", ")}

REQUIREMENTS:
1. Professional business letter format
2. Opening: Express genuine excitement about the role and company
3. Body (2-3 paragraphs):
   - Explain why you're a great fit
   - Reference 2-3 specific achievements from the list above
   - Connect your experience to their needs
   - Match the tone to cultural signals (e.g., if "fast-paced" → show energy and adaptability)
4. Closing: Clear call to action (request interview, express enthusiasm for next steps)
5. Tone: Confident but not arrogant, enthusiastic but professional
6. Length: 300-400 words (fits on one page)

DO NOT:
- Use generic phrases like "I am writing to apply"
- Repeat the resume verbatim
- Exaggerate or fabricate
- Use overly formal or stiff language

Return the complete cover letter text, properly formatted with line breaks.`

  try {
    const coverLetter = await generateWithGemini(prompt)
    return coverLetter.trim()
  } catch (error) {
    console.error("Cover letter generation error:", error)
    throw new Error("Failed to generate cover letter")
  }
}
