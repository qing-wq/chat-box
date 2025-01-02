import { OpenAiClient } from "@/lib/openAiClient"
import { MessageRequestBody } from "@/types/chat"
import { NextRequest } from "next/server"

/**
 * 创建对话
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
	const { messages, model } = (await request.json()) as MessageRequestBody
	const encoder = new TextEncoder()
	const message = messages[messages.length - 1].content // 对话列表最后一条消息

	const stream = new ReadableStream({
		async start(controller) {
			const chatCompletion = await OpenAiClient.chat.completions.create({
				messages: [{ role: "user", content: message }],
				model,
				stream: true,
			})
		
			for await (const chunk of chatCompletion) {
				const delta = chunk.choices[0]?.delta?.content || ""
				controller.enqueue(encoder.encode(delta))
			}
			
			controller.close()
		},
	})
	return new Response(stream)
}
