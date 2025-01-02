import Markdown from "@/components/common/Markdown";
import { Message } from "@/types/chat";
import { SiOpenai } from "react-icons/si";
import { useAppContext } from "../AppContext";

type Props = {
	message: Message;
};

export default function MessageItem({ message }: Props) {
	const isUser = message.role == "user";
	const {
		state: { streamingId },
	} = useAppContext();

	return (
		<div className={`${!isUser ? "bg-gray-100 dark:bg-gray-700" : ""}`}>
			<li className="relative flex max-w-[827px] min-w-[320px] mx-auto w-calc py-3">
				<div className="absolute text-3xl -left-10 top-6">
					{isUser ? "😊" : <SiOpenai className="online" />}
				</div>
				<div key={message.id} className="px-5 py-4">
					<Markdown>{`${message.content === "" ? "（🤔无效消息）" : message.content} 
					${message.id === streamingId ? "▍" : ""}`}</Markdown>
				</div>
			</li>
		</div>
	);
}
