import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	const id = request.nextUrl.searchParams.get("id")
	if (id) {
		await prisma.message.delete({
			where: {
				id,
			},
		})
	}
	return NextResponse.json({ code: 0 })
}
