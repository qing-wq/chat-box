import { Message } from "@/types/chat"
import { Chat } from "@prisma/client"

export type State = {
	displayNavigation: boolean
	theme: "dark" | "light"
	currentModel: string
	messageList: Array<Message>
	streamingId: string
	selectChatItem?: Chat
}

// 操作类型
export enum ActionType {
	UPDATE = "UPDATE",
	ADD_MESSAGE = "ADD_MESSAGE",
	UPDATE_MESSAGE = "UPDATE_MESSAGE",
	REMOVE_MESSAGE = "REMOVE_MESSAGE",
}

// 定义操作：类型、字段、值
type UpdateAction = {
	type: ActionType.UPDATE
	field: string
	value: any
}

type MessageAction = {
	type:
		| ActionType.ADD_MESSAGE
		| ActionType.UPDATE_MESSAGE
		| ActionType.REMOVE_MESSAGE
	message: Message
}

export type Action = UpdateAction | MessageAction

export const initState: State = {
	displayNavigation: true,
	theme: "dark",
	currentModel: "gpt-3.5-turbo",
	messageList: [],
	streamingId: "",
}

/*
state: 当前的状态
action: 调用更新函数传递的参数
*/
export function reducer(state: State, action: Action) {
	switch (action.type) {
		case ActionType.UPDATE:
			return {
				...state,
				[action.field]: action.value,
			}
		case ActionType.ADD_MESSAGE:
			return {
				...state,
				messageList: [...state.messageList, action.message],
			}
		case ActionType.UPDATE_MESSAGE:
			return {
				...state,
				messageList: state.messageList.map((message) => {
					if (message.id === action.message.id) {
						return action.message
					}
					return message
				}),
			}
		case ActionType.REMOVE_MESSAGE:
			return {
				...state,
				messageList: state.messageList.filter((message) => {
					return message.id !== action.message.id
				}),
			}
		default:
			return state
	}
}
