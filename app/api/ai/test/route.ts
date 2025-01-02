import { sleep } from "@/app/common/utils"
import { MessageRequestBody } from "@/types/chat"
import { NextRequest } from "next/server"

/**
 * 创建对话
 * @param request 
 * @returns 
 */
export async function POST(request: NextRequest) {
	const { messages } = (await request.json()) as MessageRequestBody
	const encoder = new TextEncoder()
	const message = messages[messages.length - 1].content
	const stream = new ReadableStream({
		async start(controller) {
			for (let i = 0; i < message.length; i++) {
				await sleep(100)
				controller.enqueue(encoder.encode(message[i]))
			}
			controller.close()
		},
	})
	return new Response(stream)
}
