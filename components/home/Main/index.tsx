import { useAppContext } from "../AppContext"
import ChatInput from "./ChatInput"
import Footer from "./Footer"
import Menu from "./Menu"
import MessageList from "./MessageList"
import WelCome from "./Welcome"

export default function Main() {
	const { state: {selectChatItem} } = useAppContext()

	return (
		<main className="flex-1 text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-100 ">
			<Menu />
			<div className="h-full flex flex-col items-center">
				{selectChatItem ? <MessageList /> : <WelCome />}
				<ChatInput />
				<Footer />
			</div>
		</main>
	)
}
