import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // System message to define the AI's role as a therapist
  const systemMessage = {
    role: "system",
    content: `Eres una terapeuta psicológica profesional, empática y comprensiva. 
    Tu objetivo es ayudar a las personas a procesar sus emociones y problemas.
    Responde en español con un tono cálido y comprensivo.
    Haz preguntas abiertas para ayudar a la persona a explorar sus pensamientos.
    No des consejos médicos específicos ni diagnósticos formales.
    Mantén tus respuestas concisas (máximo 3-4 oraciones) para que sean fáciles de escuchar cuando se conviertan en audio.`,
  }

  // Add system message to the beginning of the messages array
  const messagesWithSystem = [systemMessage, ...messages]

  const result = streamText({
    model: openai("gpt-4o"),
    messages: messagesWithSystem,
  })

  return result.toDataStreamResponse()
}

