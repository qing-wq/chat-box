import Button from "@/components/common/Button"
import { useEffect, useRef, useState } from "react"
import { FiSend } from "react-icons/fi"
import { MdRefresh } from "react-icons/md"
import { PiLightningFill, PiStopBold } from "react-icons/pi"
import TextareaAutoSize from "react-textarea-autosize"
import { useAppContext } from "../AppContext"
import { ActionType } from "@/reducer/AppReducer"
import { Message, MessageRequestBody } from "@/types/chat"
import { useEventContext } from "../EventBusContext"

export default function ChatInput() {
	const [Inputing, setInputing] = useState<boolean>(false)
	const [messageText, setMessageText] = useState<string>("")
	const {
		state: { messageList, currentModel, streamingId, selectChatItem },
		dispatch,
	} = useAppContext()
	const stopRef = useRef(false)
	const chatIdRef = useRef("")
	const { publish } = useEventContext()

	useEffect(() => {
		if (chatIdRef.current === selectChatItem?.id) {
			return
		}
		chatIdRef.current = selectChatItem?.id ?? ""
		stopRef.current = true
	}, [selectChatItem])

	const createOrUpdateMessage = async (message: Message) => {
		const response = await fetch("/api/message/upsert", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(message),
		})

		if (!response.ok) {
			console.log(response.statusText)
			return ''
		}

		const { data } = await response.json()
		if (!chatIdRef.current) {
			chatIdRef.current = data.message.chatId
			publish("fetchChatList")
			dispatch({
				type: ActionType.UPDATE,
				field: "selectChatItem",
				value: { id: chatIdRef.current },
			})
		}
		return data.message
	}

	const deleteMessage = async (id: string) => {
		const response = await fetch(`/api/message/delete?id=${id}`, {
			method: "GET",
		})

		if (!response.ok) {
			console.log(response.statusText)
			return
		}

		const { code } = await response.json()
		return code === 0
	}

	const resend = async () => {
		const messages = [...messageList]
		const lastMessage = messages[messages.length - 1]
		if (lastMessage.role === "assistant") {
			const result = await deleteMessage(lastMessage.id)
			if (!result) {
				console.log("delete message error")
				return
			}
			messages.splice(messageList.length - 1, 1)
		}
		doSend(messages)
	}

	const send = async () => {
		const message = await createOrUpdateMessage({
			id: "",
			role: "user",
			content: messageText,
			chatId: chatIdRef.current ?? "",
		})

		if(message === ''){
			return
		}

		dispatch({ type: ActionType.ADD_MESSAGE, message })
		const messages = messageList.concat(message)
		doSend(messages)
		setMessageText("")
	}

	/**
	 * AI调用
	 * @param messages 当前消息列表
	 * @returns
	 */
	const doSend = async (messages: Message[]) => {
		stopRef.current = false
		const body: MessageRequestBody = {
			messages: messages,
			model: currentModel,
		}

		const controller = new AbortController()
		const response = await fetch("/api/ai", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			signal: controller.signal,
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			console.log(response.statusText)
			return
		}
		if (!response.body) {
			console.log("body error")
			return
		}

		const responseMessage: Message = await createOrUpdateMessage({
			id: "",
			role: "assistant",
			content: "",
			chatId: chatIdRef.current ?? "",
		})
		dispatch({ type: ActionType.ADD_MESSAGE, message: responseMessage })
		dispatch({
			type: ActionType.UPDATE,
			field: "streamingId",
			value: responseMessage.id,
		})

		const reader = response.body.getReader()
		const decoder = new TextDecoder()
		let isDone = false
		while (!isDone) {
			if (stopRef.current) {
				controller.abort()
				stopRef.current = false
				break
			}
			const result = await reader.read()
			isDone = result.done
			const chunk = decoder.decode(result.value)
			responseMessage.content += chunk
			dispatch({
				type: ActionType.UPDATE_MESSAGE,
				message: responseMessage,
			})
		}

		await createOrUpdateMessage(responseMessage)
		dispatch({
			type: ActionType.UPDATE,
			field: "streamingId",
			value: "",
		})
	}

	return (
		<div className="relative w-calc-input max-w-4xl min-w-[320px] flex flex-col items-center mt-3">
			{messageList.length !== 0 &&
				(streamingId !== "" ? (
					<Button
						icon={PiStopBold}
						variant="primary"
						className="absolute -top-14 bg-opacity-80"
						onClick={() => {
							stopRef.current = true
						}}
					>
						停止生成
					</Button>
				) : (
					<Button
						icon={MdRefresh}
						variant="primary"
						className="absolute -top-14 bg-opacity-80"
						onClick={resend}
					>
						重新生成
					</Button>
				))}
			<div
				className={`flex items-center w-full border-2 dark:border-gray-800/50 bg-white dark:bg-gray-700 rounded-[30px] py-3 ${
					Inputing
						? "border-gray-300 dark:border-primary-500/60"
						: "border-black/10 dark:border-gray-800/50"
				}`}
			>
				<div className="mx-3 text-primary-500 text">
					<PiLightningFill />
				</div>
				<TextareaAutoSize
					className="flex-1 max-h-[120px] bg-transparent outline-none resize-none dark:text-whiteoverflow-y-auto"
					placeholder="在这里输入你的问题..."
					rows={1}
					value={messageText}
					onFocus={() => setInputing(true)}
					onBlur={() => setInputing(false)}
					onChange={(e) => setMessageText(e.target.value)}
					onKeyDown={(e) => {
						if (e.key == "Enter") {
							send()
							e.preventDefault()
						}
					}}
				/>
				<Button
					icon={FiSend}
					variant="primary"
					className={`mx-3 !rounded-full disabled:cursor-not-allowed`}
					disabled={streamingId !== "" || messageText.trim() === ""}
					onClick={send}
				/>
			</div>
		</div>
	)
}
