import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1")
	const pageSize = parseInt(
		request.nextUrl.searchParams.get("pageSize") ?? "20"
	)
	const chatList = await prisma.chat.findMany({
		skip: (page - 1) * pageSize,
		take: pageSize,
		orderBy: {
			updateTime: "desc",
		},
	})
	const total = await prisma.chat.count()
	const hasMore = total > page * pageSize

	return NextResponse.json({ code: 0, data: { chatList, hasMore, total } })
}
