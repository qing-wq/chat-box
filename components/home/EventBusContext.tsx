/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react"

export type EventListener = (data?: any) => void

type EventBusContextProps = {
	subcribe: (event: string, callback: EventListener) => void
	unsubcribe: (event: string, callback: EventListener) => void
	publish: (event: string, data?: any) => void
}

const EventBusContextProvider = createContext<EventBusContextProps>(null!)

export function useEventContext() {
	return useContext(EventBusContextProvider)
}

export default function EventContextProvider({
	children,
}: {
	children: ReactNode
}) {
	const [listners, setListeners] = useState<Record<string, EventListener[]>>({})

	const subcribe = useCallback((event: string, callback: EventListener) => {
		if (!listners[event]) {
			listners[event] = []
		}
		listners[event].push(callback)
		setListeners(listners)
	}, [listners])

	const unsubcribe = useCallback((event: string, callback: EventListener) => {
		if (listners[event]) {
			listners[event] = listners[event].filter((cb) => cb !== callback)
			setListeners(listners)
		}
	}, [listners])

	const publish = useCallback((event: string, data?: any) => {
		if (listners[event]) {
			listners[event].forEach((cb) => cb(data))
		}
	}, [listners])

	const contextValue = useMemo(() => {
		return { subcribe, unsubcribe, publish }
	}, [subcribe, unsubcribe, publish])

	return <EventBusContextProvider.Provider value={contextValue}>{children}</EventBusContextProvider.Provider>
}
