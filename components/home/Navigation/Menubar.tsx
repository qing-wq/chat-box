import Button from "@/components/common/Button"
import { HiPlus } from "react-icons/hi"
import { LuPanelLeft } from "react-icons/lu"
import { useAppContext } from "@/components/home/AppContext"
import { ActionType } from "@/reducer/AppReducer"

export default function Menubar() {
	const { dispatch } = useAppContext()

	return (
		<div className="flex space-x-3 bg-gray-900 text-gray-300">
			<Button
				icon={HiPlus}
				variant="outline"
				className="flex-1"
				onClick={() => {
					dispatch({
						type: ActionType.UPDATE,
						field: "selectChatItem",
						value: null,
					})
					dispatch({
						type: ActionType.UPDATE,
						field: "messageList",
						value: [],
					})
				}}
			>
				新建对话
			</Button>
			<Button
				icon={LuPanelLeft}
				variant="outline"
				onClick={() =>
					dispatch({
						type: ActionType.UPDATE,
						field: "displayNavigation",
						value: false,
					})
				}
			/>
		</div>
	)
}
