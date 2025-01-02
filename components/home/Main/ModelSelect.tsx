import { PiLightningFill, PiShootingStarFill } from "react-icons/pi"
import { useAppContext } from "../AppContext"
import { ActionType } from "@/reducer/AppReducer"

export default function ModelSelect() {
	const models = [
		{
			id: "gpt-3.5-turbo",
			name: "GPT-3.5",
			icon: PiLightningFill,
		},
		{
			id: "gpt-4-mini",
			name: "GPT-4",
			icon: PiShootingStarFill,
		},
	]

	const {
		state: { currentModel },
		dispatch,
	} = useAppContext()

	return (
		<div className="flex bg-gray-100 dark:bg-gray-900 rounded p-1 ">
			{models.map((item) => {
				const selected = currentModel === item.id
				return (
					<button
						key={item.id}
						className={`group hover:text-gray-900 hover:dark:text-gray-100 flex justify-center items-center space-x-2 min-w-[168px] py-2 text-sm font-medium border rounded ${
							selected
								? "border-gray-200 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
								: "border-transparent text-gray-500"
						}
                        `}
						onClick={() =>
							dispatch({
								type: ActionType.UPDATE,
								field: "currentModel",
								value: item.id,
							})
						}
					>
						<span
							className={`group-hover:text-[#26cf8e] ${
								selected ? "text-[#26cf8e]" : ""
							}`}
						>
							<item.icon />
						</span>
						<span className="transition-colors duration-100">{item.name}</span>
					</button>
				)
			})}
		</div>
	)
}
