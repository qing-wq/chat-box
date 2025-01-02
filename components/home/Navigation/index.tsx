"use client"

import Menubar from "./Menubar"
import { useAppContext } from "@/components/home/AppContext"
import ToolBar from "./Toolbar"
import ChatList from "./ChatList"

export default function Navigation() {
	const {
		state: { displayNavigation },
	} = useAppContext()

	return (
		<nav
			className={` ${
				displayNavigation ? "" : "hidden"
			} dark flex flex-col relative h-full w-[260px] bg-gray-900 text-gray-300 p-2`}
		>
			<Menubar />
			<ChatList />
			<ToolBar />
		</nav>
	)
}
