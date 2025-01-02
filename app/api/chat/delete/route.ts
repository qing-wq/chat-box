import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	const id = request.nextUrl.searchParams.get("chatId")
	if (id) {
		const deleteMessage = prisma.message.deleteMany({
			where: {
				chatId: id
			}
		})

		const deleteChat = prisma.chat.delete({
			where: {
				id,
			},
		})
		await prisma.$transaction([deleteMessage, deleteChat])
	}
	return NextResponse.json({code: 0})
}
