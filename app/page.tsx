"use client"

import Navigation from "@/components/home/Navigation"
import Main from "@/components/home/Main"
import { useAppContext } from "@/components/home/AppContext"

export default function Home() {
	const { state } = useAppContext()

	return (
		<div className={`${state.theme} flex h-full`}>
			<Navigation />
			<Main />
		</div>
	)
}
