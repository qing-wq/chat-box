import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Chat",
}

export default function Chat() {
	return (
		<main>
			<h1 className="text-3xl font-bold">Chat Page</h1>
		</main>
	)
}
