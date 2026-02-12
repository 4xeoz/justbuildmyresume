import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
})

export async function generateWithGemini(prompt: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error("Gemini API error:", error)
    throw new Error("Failed to generate content with Gemini")
  }
}

export async function generateJSONWithGemini<T>(prompt: string): Promise<T> {
  try {
    const result = await geminiModel.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    return JSON.parse(cleanedText) as T
  } catch (error) {
    console.error("Gemini JSON parsing error:", error)
    throw new Error("Failed to generate valid JSON with Gemini")
  }
}
