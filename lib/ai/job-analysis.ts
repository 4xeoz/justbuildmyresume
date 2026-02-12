import { generateJSONWithGemini } from "../gemini"

export interface JobAnalysisResult {
  requiredSkills: string[]
  preferredSkills: string[]
  responsibilities: string[]
  seniority: "junior" | "mid" | "senior" | "lead" | "principal"
  industry: string
  keywords: string[]
  culturalSignals: string[]
  priorities: string[]
}

export async function analyzeJobDescription(
  jobDescription: string,
  jobTitle: string,
  companyName: string
): Promise<JobAnalysisResult> {
  const prompt = `You are an expert job description analyzer. Analyze the following job posting and extract key information in JSON format.

Job Title: ${jobTitle}
Company: ${companyName}

Job Description:
${jobDescription}

Extract and return a JSON object with the following structure:
{
  "requiredSkills": ["skill1", "skill2", ...],
  "preferredSkills": ["skill1", "skill2", ...],
  "responsibilities": ["responsibility1", "responsibility2", ...],
  "seniority": "junior" | "mid" | "senior" | "lead" | "principal",
  "industry": "industry name",
  "keywords": ["keyword1", "keyword2", ...] (for ATS optimization),
  "culturalSignals": ["signal1", "signal2", ...] (e.g., "fast-paced", "collaborative"),
  "priorities": ["priority1", "priority2", ...] (what matters most in this role)
}

Be thorough and extract all relevant skills, technologies, and requirements mentioned.
For seniority, infer from years of experience, responsibility level, and role expectations.
Include specific technologies, frameworks, tools, and methodologies mentioned.

Return ONLY valid JSON, no additional text or explanation.`

  try {
    const result = await generateJSONWithGemini<JobAnalysisResult>(prompt)
    return result
  } catch (error) {
    console.error("Job analysis error:", error)
    throw new Error("Failed to analyze job description")
  }
}
