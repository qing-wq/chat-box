import { groupByDate } from "@/app/common/utils"
import { Chat } from "@/types/chat"
import { useEffect, useMemo, useRef, useState } from "react"
import ChatItem from "./ChatItem"
import { useEventContext } from "../EventBusContext"
import { EventListener } from "../EventBusContext"
import { useAppContext } from "../AppContext"
import { ActionType } from "@/reducer/AppReducer"

export default function ChatList() {
	const [chatList, setChatList] = useState<Chat[]>([])
	const {
		state: { selectChatItem },
		dispatch,
	} = useAppContext()
	const groupList = useMemo(() => groupByDate(chatList), [chatList])
	const { subcribe, unsubcribe } = useEventContext()

	const pageRef = useRef(1)
	const loadMoreRef = useRef(null)
	const hasMore = useRef(false)

	useEffect(() => {
		getChatList()
	}, [])

	useEffect(() => {
		const callback: EventListener = () => {
			pageRef.current = 1
			getChatList()
		}

		subcribe("fetchChatList", callback)

		return () => {
			unsubcribe("fetchChatList", () => {
				console.log("unsubcribe fetchChatList")
			})
		}
	}, [])

	useEffect(() => {
		let observer: IntersectionObserver | null = null
		const div = loadMoreRef.current
		if (div) {
			observer = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore.current) {
					getChatList()
				}
			})

			observer.observe(div)
		}

		return () => {
			if (observer && div) {
				observer.unobserve(div)
			}
		}
	}, [])

	/**
	 * 消息查询分页方法
	 * @param page
	 * @param pageSize
	 * @returns
	 */
	const getChatList = async (
		page: number = pageRef.current,
		pageSize: number = 20
	) => {
		const response = await fetch(
			`/api/chat/list?page=${page}&pageSize=${pageSize}`,
			{
				method: "GET",
			}
		)

		const { data } = await response.json()
		const lists = data.chatList
		if (pageRef.current === 1) {
			setChatList(lists)
		} else {
			setChatList((list) => list.concat(lists))
		}

		hasMore.current = data.hasMore
		pageRef.current++
	}

	return (
		<div className="flex-1 flex flex-col mb-[48px] mt-2 overflow-y-auto">
			{groupList.map(([data, list]) => {
				return (
					<div key={data}>
						<div className="sticky top-0 z-10 text-sm p-3 bg-gray-900 text-gray-500">
							{data}
						</div>
						<ul>
							{list.map((item) => {
								const selected = selectChatItem?.id === item.id

								return (
									<ChatItem
										key={item.id}
										item={item}
										selected={selected}
										onSelected={() =>
											dispatch({
												type: ActionType.UPDATE,
												field: "selectChatItem",
												value: item,
											})
										}
									/>
								)
							})}
						</ul>
					</div>
				)
			})}
			<div ref={loadMoreRef} className="text-center text-gray-600 text-sm my-2">
				{ chatList.length == 0
					? ""
					: hasMore.current
					? "正在加载..."
					: "没有更多了~"}
			</div>
		</div>
	)
}
