"use client"
import { Action, initState, reducer, State } from "@/reducer/AppReducer"
import {
	createContext,
	Dispatch,
	ReactNode,
	useContext,
	useMemo,
	useReducer,
} from "react"

type AppContextProps = {
	state: State
	dispatch: Dispatch<Action>
}

const AppContext = createContext<AppContextProps>(null!)

export function useAppContext() {
	return useContext(AppContext)
}

export default function AppContextProvider({
	children,
}: {
	children: ReactNode
}) {
	const [state, dispatch] = useReducer(reducer, initState)
	const contextValue = useMemo(() => {
		return { state, dispatch }
	}, [state, dispatch])

	return (
		<AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
	)
}
