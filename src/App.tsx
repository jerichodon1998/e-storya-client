import { useState } from "react";
import { cn } from "./lib";
import { useChatWebsocket } from "@hooks/useChatWebsocket";
import "./App.css";

function App() {
	const { chatWebsocketService, messages, userId } = useChatWebsocket();
	const [message, setMessage] = useState("");

	function onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
		setMessage(e?.target?.value);
	}

	function sendMessage(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		if (chatWebsocketService) {
			const data = JSON.stringify({ content: message, userId });
			chatWebsocketService.current?.websocket?.send(data);
		}

		setMessage("");
	}

	return (
		<div className="w-full flex flex-col items-center justify-center p-4">
			<h1 className="font-bold text-[24px]">E-storya</h1>
			<h1>{userId?.toString()}</h1>
			<div className="w-[50%] flex flex-col items-center justify-center gap-4">
				<ul className="min-h-50 border border-black p-2 rounded-lg w-full">
					{messages.map((message, i) => {
						return (
							<li key={i} className={cn("p-1", i % 2 === 0 && "bg-gray-300")}>
								{userId.equals(message?.userId) ? (
									<p>
										<span className="font-semibold">You:</span>{" "}
										{message.content}
									</p>
								) : (
									<p>
										<span>User:</span> {message.content}
									</p>
								)}
							</li>
						);
					})}
				</ul>
				<form className="flex justify-center" onSubmit={sendMessage}>
					<div className="flex justify-end items-center gap-2">
						<input
							type="text"
							onChange={onChangeInput}
							value={message}
							className="border border-black rounded-md p-1"
						/>
						<button className="text-[18px] font-semibold" type="submit">
							Send
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default App;
