import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// update chat by id
export async function POST(request: NextRequest) {
	const data = await request.json()
	await prisma.chat.update({
		data,
		where: {
			id: data.id
		}
	})

	return NextResponse.json({code: 0})
}
