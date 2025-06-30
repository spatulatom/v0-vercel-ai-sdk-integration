import { streamText } from "ai"
import { google } from "@ai-sdk/google"

const model = google("gemini-1.5-flash", {
  apiKey: process.env.GEMINI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: model,
      messages,
      system: "You are a helpful AI assistant. Provide clear, concise, and helpful responses.",
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat:", error)
    return Response.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
