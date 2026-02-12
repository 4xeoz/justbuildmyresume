import { generateWithGemini } from "../gemini"
import { JobAnalysisResult } from "./job-analysis"

export async function tailorHighlight(
  originalHighlight: string,
  experienceTitle: string,
  experienceOrg: string,
  jobAnalysis: JobAnalysisResult
): Promise<string> {
  const prompt = `You are helping tailor a resume highlight for a specific job application.

CRITICAL RULES (NEVER VIOLATE):
1. DO NOT add any accomplishments not in the original highlight
2. DO NOT change any numbers, percentages, dollar amounts, or metrics
3. DO NOT add technologies, tools, or skills not mentioned in the original
4. ONLY adjust word choice, phrasing, and emphasis
5. Keep all facts and metrics IDENTICAL to the original
6. If you're unsure how to tailor without changing facts, return the original unchanged

Original Highlight:
"${originalHighlight}"

Experience Context:
- Role: ${experienceTitle}
- Organization: ${experienceOrg}

Target Job Requirements:
- Required Skills: ${jobAnalysis.requiredSkills.join(", ")}
- Priorities: ${jobAnalysis.priorities.join(", ")}
- Keywords: ${jobAnalysis.keywords.slice(0, 10).join(", ")}

Task: Rewrite the highlight to emphasize aspects most relevant to the target job, while keeping ALL facts identical.

Examples of ALLOWED changes:
- "Built testing framework" → "Developed automated CI/CD testing framework" (if CI/CD is relevant)
- "Led team of 5" → "Managed and mentored team of 5 engineers" (if leadership is relevant)
- "Reduced costs by 30%" → "Optimized infrastructure costs, achieving 30% reduction" (emphasis change)

Examples of FORBIDDEN changes:
- Adding metrics not in original
- Adding technologies not mentioned
- Exaggerating impact or scope
- Fabricating details

Return ONLY the tailored highlight text, no additional explanation or formatting.`

  try {
    const tailored = await generateWithGemini(prompt)
    return tailored.trim()
  } catch (error) {
    console.error("Highlight tailoring error:", error)
    // Fallback to original if AI fails
    return originalHighlight
  }
}
