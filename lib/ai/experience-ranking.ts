import { generateJSONWithGemini } from "../gemini"
import { JobAnalysisResult } from "./job-analysis"

export interface ExperienceRankingResult {
  experienceId: string
  relevanceScore: number
  reasoning: string
  selectedHighlights: {
    highlightId: string
    relevanceScore: number
  }[]
}

export async function rankExperiences(
  experiences: any[],
  jobAnalysis: JobAnalysisResult
): Promise<ExperienceRankingResult[]> {
  const prompt = `You are an expert resume consultant. Rank the following user experiences by relevance to the job requirements.

Job Analysis:
- Required Skills: ${jobAnalysis.requiredSkills.join(", ")}
- Preferred Skills: ${jobAnalysis.preferredSkills.join(", ")}
- Responsibilities: ${jobAnalysis.responsibilities.join(", ")}
- Seniority: ${jobAnalysis.seniority}
- Priorities: ${jobAnalysis.priorities.join(", ")}

User Experiences:
${JSON.stringify(experiences, null, 2)}

For each experience:
1. Score its relevance from 0-100
2. Provide brief reasoning
3. Select the 2-4 most relevant highlights for this job
4. Score each highlight's relevance from 0-100

Selection Guidelines:
- Choose experiences that best match required skills and responsibilities
- Prioritize recent and relevant experiences
- Aim to fill 1-2 pages (roughly 8-12 total highlights across all experiences)
- Select top 3-5 experiences maximum

Return a JSON array of ranked experiences:
[
  {
    "experienceId": "experience_id",
    "relevanceScore": 95,
    "reasoning": "Brief explanation of relevance",
    "selectedHighlights": [
      {
        "highlightId": "highlight_id",
        "relevanceScore": 90
      }
    ]
  }
]

Return ONLY valid JSON, no additional text.`

  try {
    const result = await generateJSONWithGemini<ExperienceRankingResult[]>(prompt)
    return result.sort((a, b) => b.relevanceScore - a.relevanceScore)
  } catch (error) {
    console.error("Experience ranking error:", error)
    throw new Error("Failed to rank experiences")
  }
}
