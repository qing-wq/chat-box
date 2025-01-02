"use client"
import Button from "@/components/common/Button"
import { LuPanelLeft } from "react-icons/lu"
import { useAppContext } from "../AppContext"
import { ActionType } from "@/reducer/AppReducer"

export default function Menu() {
	const { state, dispatch } = useAppContext()

	return (
		<Button
			className={`${
				!state.displayNavigation ? "" : "hidden"
			} fixed left-2 top-2`}
			icon={LuPanelLeft}
			variant="outline"
			onClick={() =>
				dispatch({
					type: ActionType.UPDATE,
					field: "displayNavigation",
					value: true,
				})
			}
		/>
	)
}
