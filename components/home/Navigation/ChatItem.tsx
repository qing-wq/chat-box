import { Chat } from "@/types/chat"
import { useEffect, useState } from "react"
import { AiOutlineEdit } from "react-icons/ai"
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md"
import { PiChatBold, PiTrashBold } from "react-icons/pi"
import { useAppContext } from "../AppContext"
import { ActionType } from "@/reducer/AppReducer"
import { useEventContext } from "../EventBusContext"

type Props = {
	item: Chat
	selected: boolean
	onSelected: (chat: Chat) => void
}

export default function ChatItem({ item, selected, onSelected }: Props) {
	const [editing, setEditing] = useState<boolean>(false)
	const [deleting, setDeleting] = useState<boolean>(false)
	const [newTitle, setNewTitle] = useState<string>(item.title)

	const { publish } = useEventContext()
	const { dispatch } = useAppContext()

	const updateChatById = async (chat: Chat) => {
		const response = await fetch(`api/chat/update`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(chat),
		})

		if (!response.ok) {
			console.log(response.statusText)
			return
		}

		const { code } = await response.json()
		if (code === 0) {
			publish("fetchChatList")
		}
	}

	const deleteChat = async (id: string) => {
		const response = await fetch(`api/chat/delete?chatId=${id}`, {
			method: "GET",
		})

		if (!response.ok) {
			console.log(response.statusText)
			return
		}

		const { code } = await response.json()
		if (code === 0) {
			publish("fetchChatList")
			dispatch({
				type: ActionType.UPDATE,
				field: "selectChatItem",
				value: null,
			})
		}
	}

	useEffect(() => {
		setEditing(false)
	}, [selected])

	return (
		<li
			className={`relative group flex items-center hover:bg-gray-800 p-3 space-x-3 cursor-pointer rounded-md ${
				selected ? "bg-gray-800 pr-[2.8rem]" : ""
			} `}
			onClick={() => onSelected(item)}
		>
			<div>
				{deleting ? (
					<PiTrashBold className="text-lg" />
				) : (
					<PiChatBold className="text-lg" />
				)}
			</div>
			{editing ? (
				<input
					autoFocus={true}
					className="flex-1 min-w-0 bg-transparent outline-none"
					// defaultValue={item.title}
					value={newTitle}
					onChange={(e) => {
						setNewTitle(e.target.value)
					}}
				/>
			) : (
				<div className="relative flex-1 whitespace-nowrap overflow-hidden">
					{item.title}
					<span
						// group 使悬浮在组内元素上时，当前元素可以响应
						className={`group-hover:from-gray-800 absolute right-0 inset-y-0 w-8  bg-gradient-to-l ${
							selected ? "from-gray-800" : "from-gray-900"
						}`}
					></span>
				</div>
			)}

			{selected && (
				<div className="absolute right-1 flex">
					{editing || deleting ? (
						<>
							<button
								onClick={(e) => {
									if (editing) {
										item.title = newTitle
										updateChatById(item)
										setEditing(false)
									} else if (deleting) {
										deleteChat(item.id)
										setDeleting(false)
									}

									e.stopPropagation()
								}}
							>
								<MdCheck className="text-lg" />
							</button>
							<button
								onClick={(e) => {
									if (editing) {
										setNewTitle(item.title)
										setEditing(false)
									} else if (deleting) {
										setDeleting(false)
									}
									e.stopPropagation()
								}}
							>
								<MdClose className="text-lg" />
							</button>
						</>
					) : (
						<>
							<button onClick={() => setEditing(true)}>
								<AiOutlineEdit className="text-lg" />
							</button>
							<button onClick={() => setDeleting(true)}>
								<MdDeleteOutline className="text-lg" />
							</button>
						</>
					)}
				</div>
			)}
		</li>
	)
}
