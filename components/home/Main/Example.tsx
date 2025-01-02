import Button from "@/components/common/Button"
import examples from "@/data/example.json"
import { useMemo, useState } from "react"
import { MdOutlineTipsAndUpdates } from "react-icons/md"

export default function Example() {
	const [showFull, setShowFull] = useState<boolean>(false)
	const list = useMemo(() => {
		if (showFull) return examples
		else return examples.slice(0, 15)
	}, [showFull])

	return (
		<>
			<div className="text-4xl mt-20 mb-4">
				<MdOutlineTipsAndUpdates />
			</div>
			<ul className="flex justify-center flex-wrap gap-3.5">
				{list.map((item) => {
					return (
						<li key={item.act}>
							<Button>{item.act}</Button>
						</li>
					)
				})}
			</ul>
			{!showFull && (
				<>
					<p>...</p>
					<div className="flex items-center w-full space-x-2 mt-5">
						<hr className="flex-1 border-t border-dotted border-gray-200 dark:border-gray-600" />
						<Button onClick={() => setShowFull(true)}>显示全部</Button>
						<hr className="flex-1 border-t border-dotted border-gray-200 dark:border-gray-600" />
					</div>
				</>
			)}
		</>
	)
}
