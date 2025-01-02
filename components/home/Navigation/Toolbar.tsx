import Button from "@/components/common/Button"
import { useAppContext } from "@/components/home/AppContext"
import { ActionType } from "@/reducer/AppReducer"
import { MdLightMode, MdDarkMode, MdInfo } from "react-icons/md"

export default function ToolBar() {
	const {
		state: { theme },
		dispatch,
	} = useAppContext()

	return (
		<div className="absolute flex bottom-0 left-0 right-0 bg-gray-800 text-gray-300 justify-between p-2 ">
			<Button
				icon={theme === "dark" ? MdDarkMode : MdLightMode}
				variant="text"
				onClick={() =>
					dispatch({
						type: ActionType.UPDATE,
						field: "theme",
						value: theme === "dark" ? "light" : "dark",
					})
				}
			></Button>
			<Button icon={MdInfo} variant="text" />
		</div>
	)
}
