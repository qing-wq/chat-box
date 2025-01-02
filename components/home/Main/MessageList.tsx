import MessageItem from "./MessageItem"
import { useAppContext } from "../AppContext"
import { useEffect } from "react"
import { ActionType } from "@/reducer/AppReducer"

export default function MessageList() {
	const {
		state: { messageList, selectChatItem },
		dispatch,
	} = useAppContext()

	const getMessagesByChatId = async (chatId: string) => {
		const response = await fetch(`/api/message/list?chatId=${chatId}`, {
			method: "GET",
		})

		if (!response.ok) {
			console.log(response.statusText)
			return
		}

		const { data } = await response.json()
		return data.messages
	}

	useEffect(() => {
		if (selectChatItem) {
			getMessagesByChatId(selectChatItem.id).then((messages) => {
				dispatch({
					type: ActionType.UPDATE,
					field: "messageList",
					value: messages,
				})
			})
		} else {
			dispatch({
				type: ActionType.UPDATE,
				field: "messageList",
				value: [],
			})
		}
	}, [selectChatItem])

	return (
		<div className="flex-1 w-full overflow-y-auto">
			<ul>
				{messageList.map((message) => {
					return <MessageItem key={message.id} message={message} />
				})}
			</ul>
		</div>
	)
}
