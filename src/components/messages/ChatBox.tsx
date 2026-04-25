import { useAuth } from "@hooks/useAuth";
import { useChatWebsocket } from "@hooks/useChatWebsocket";
import { useMessages } from "@hooks/useMessages";
import { cn, sortMessages } from "@lib";
import type { IMessage } from "@types";
import { map } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

export default function ChatBox(props: {
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
}) {
	const scrollRef = useRef<HTMLUListElement | null>(null);

	const { channelId } = useParams();

	const [message, setMessage] = useState("");

	const { user } = useAuth();

	const { className } = props;

	const { messagesData } = useMessages();

	const { chatWebsocketService } = useChatWebsocket();

	const handleSubmit = () => {
		try {
			const parsedMessage = JSON.stringify({
				content: message,
				userId: user?._id,
				channelId,
				type: "text",
			} as Partial<IMessage>);

			chatWebsocketService.websocket.send(parsedMessage);
			setMessage("");
		} catch (error) {
			console.error("error", error);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messagesData]);

	return (
		<div
			className={cn(
				"p-4 shadow-md bg-gray-300 rounded-lg h-full flex flex-col justify-between gap-4 text-sm",
				className
			)}
		>
			<ul
				className="overflow-y-scroll flex flex-col gap-4 pr-4 h-full"
				ref={scrollRef}
				onScrollEnd={() => {
					// fetch more here
				}}
			>
				{map(sortMessages({ messages: messagesData }), (message, i) => {
					const itemKey = `${message._id}-${i}`;

					return (
						<li
							key={itemKey}
							className={cn(
								"rounded-lg py-1 px-2 flex",
								message.userId === user?._id
									? "self-end bg-blue-400"
									: "self-start bg-gray-400"
							)}
						>
							<p>{message.content}</p>
						</li>
					);
				})}
			</ul>
			<form id="messageForm" className="flex gap-2" onSubmit={handleSubmit}>
				<textarea
					placeholder="Type your message"
					className="flex-9 p-2 border border-gray-800 rounded-md resize-none"
					rows={1}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<button
					className="flex-1 border border-gray-800 rounded-md"
					type="button"
					onClick={handleSubmit}
				>
					Send
				</button>
			</form>
		</div>
	);
}
