import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

const model = google("gemini-1.5-flash", {
  apiKey: process.env.GEMINI_API_KEY!,
})

const userProfileSchema = z.object({
  name: z.string().describe("Full name of the person"),
  age: z.number().describe("Age in years"),
  occupation: z.string().describe("Job title or profession"),
  skills: z.array(z.string()).describe("List of professional skills"),
  bio: z.string().describe("Short biographical description"),
  contact: z.object({
    email: z.string().describe("Email address"),
    location: z.string().describe("City and country"),
  }),
  preferences: z.object({
    workStyle: z.enum(["remote", "hybrid", "onsite"]).describe("Preferred work arrangement"),
    interests: z.array(z.string()).describe("Personal interests and hobbies"),
  }),
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const { object } = await generateObject({
      model: model,
      prompt: `Generate a realistic user profile based on this description: ${prompt}`,
      schema: userProfileSchema,
    })

    return Response.json({ object })
  } catch (error) {
    console.error("Error generating object:", error)
    return Response.json({ error: "Failed to generate object" }, { status: 500 })
  }
}
