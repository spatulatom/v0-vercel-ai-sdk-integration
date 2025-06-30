import { generateText, tool } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

const GEMINI_KEY = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY

if (!GEMINI_KEY) {
  throw new Error("Google Gemini API key missing – set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY")
}

const model = google("gemini-1.5-flash", { apiKey: GEMINI_KEY })

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await generateText({
      model: model,
      messages,
      tools: {
        getWeather: tool({
          description: "Get current weather information for a specific location",
          parameters: z.object({
            location: z.string().describe("The city and country, e.g. San Francisco, CA"),
          }),
          execute: async ({ location }) => {
            // Simulate weather API call
            const conditions = ["sunny", "cloudy", "rainy", "partly cloudy"]
            const condition = conditions[Math.floor(Math.random() * conditions.length)]
            const temperature = Math.floor(Math.random() * 30) + 10 // 10-40°C

            return {
              location,
              temperature: `${temperature}°C`,
              condition,
              humidity: `${Math.floor(Math.random() * 40) + 40}%`,
              windSpeed: `${Math.floor(Math.random() * 20) + 5} km/h`,
            }
          },
        }),
        calculate: tool({
          description: "Perform mathematical calculations",
          parameters: z.object({
            expression: z.string().describe('Mathematical expression to evaluate, e.g. "2 + 2" or "15% of 100"'),
          }),
          execute: async ({ expression }) => {
            try {
              // Handle percentage calculations
              if (expression.includes("%")) {
                const percentMatch = expression.match(/(\d+(?:\.\d+)?)%\s*(?:of|on)\s*(\d+(?:\.\d+)?)/i)
                if (percentMatch) {
                  const percentage = Number.parseFloat(percentMatch[1])
                  const amount = Number.parseFloat(percentMatch[2])
                  const result = (percentage / 100) * amount
                  return {
                    expression,
                    result: result.toFixed(2),
                    explanation: `${percentage}% of ${amount} = ${result.toFixed(2)}`,
                  }
                }
              }

              // Handle basic arithmetic (simplified for demo)
              const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, "")
              const result = Function(`"use strict"; return (${sanitized})`)()

              return {
                expression,
                result: result.toString(),
                explanation: `${expression} = ${result}`,
              }
            } catch (error) {
              return {
                expression,
                result: "Error",
                explanation: "Could not evaluate the expression",
              }
            }
          },
        }),
      },
      maxSteps: 3,
    })

    return Response.json({
      content: result.text,
      toolInvocations:
        result.toolCalls?.map((call) => ({
          toolName: call.toolName,
          args: call.args,
          result: result.toolResults?.find((r) => r.toolCallId === call.toolCallId)?.result,
        })) || [],
    })
  } catch (error) {
    console.error("Error in tools chat:", error)
    return Response.json({ error: "Failed to process chat with tools" }, { status: 500 })
  }
}
