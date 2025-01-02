import { OpenAiClient } from "@/lib/openAiClient"
import prisma from "@/lib/prisma"
import { Message } from "@/types/chat"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
	const data = (await request.json()) as Message
	const { id, content, chatId } = data
	if (!chatId) {
		// 新对话
		console.log("create new chat")
		const title = await genTitle(content, "gpt-4o-mini")
		const chat = await prisma.chat.create({
			data: {
				title,
			},
		})
		data.chatId = chat.id
	} else {
		console.log("update message")
		await prisma.chat.update({
			data: {
				updateTime: new Date(),
			},
			where: {
				id: chatId,
			},
		})
	}
	console.log(data)
	// const message = await prisma.message.upsert({
	// 	create: data,
	// 	update: data,
	// 	where: {
	// 		id,
	// 	},
	// })
	let message = null
	if (!id) {
		console.log("create message")
		message = await prisma.message.create({
			data: {
				role: data.role,
				content: data.content,
				chatId: data.chatId,
			},
		})
	} else {
		console.log("update message")
		message = await prisma.message.update({
			data,
			where: {
				id,
			},
		})
	}
	return NextResponse.json({ code: 0, data: { message } })
}

const genTitle = async (message: string, model: string) => {
	const chatCompletion = await OpenAiClient.chat.completions.create({
		messages: [
			{
				role: "system",
				content:
					"根据用户的提问，为本次对话生成一个标题，要求简介明了，不要解释、不要标点、不要语气词、不要多余文本，如果没有主题，请直接返回'新对话'，内容5-10个字",
			},
			{ role: "user", content: message },
		],
		model,
	})

	return chatCompletion.choices[0].message.content || ""
}
