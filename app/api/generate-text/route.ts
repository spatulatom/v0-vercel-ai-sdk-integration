import { generateText } from "ai"
import { google } from "@ai-sdk/google"

const model = google("gemini-1.5-flash", {
  apiKey: process.env.GEMINI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 500,
    })

    return Response.json({ text })
  } catch (error) {
    console.error("Error generating text:", error)
    return Response.json({ error: "Failed to generate text" }, { status: 500 })
  }
}
