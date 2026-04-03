import { useEffect, useState } from "react";
import "./App.css";
import { cn } from "./lib";
import { createId } from "@paralleldrive/cuid2";

const userId = createId();

function App() {
	const [websocket, setWebsocket] = useState<WebSocket | null>(null);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<
		{ userId: string; content: string }[]
	>([]);

	function onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
		setMessage(e?.target?.value);
	}

	function sendMessage(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		if (websocket) {
			const data = JSON.stringify({ content: message, userId });
			websocket.send(data);
		}

		setMessage("");
	}

	async function connectWs() {
		const ws = new WebSocket(`ws://localhost:3001/ws?userId=${userId}`);

		return new Promise((resolve, reject) => {
			const timer = setInterval(() => {
				if (ws.readyState === 1) {
					clearInterval(timer);
					ws.onopen = () => {
						console.log("ws connected");
					};

					ws.onmessage = (event) => {
						const data = JSON.parse(event.data);
						setMessages((prev) => [...prev, data]);
					};

					ws.onclose = () => {
						console.log("ws closed");
					};

					setWebsocket(ws);
					resolve(ws);
				}
			}, 10);
		});
	}

	useEffect(() => {
		if (!websocket) {
			connectWs();
		}

		return () => {
			setWebsocket(null);
		};
	}, []);

	return (
		<div className="w-full flex flex-col items-center justify-center p-4">
			<h1 className="font-bold text-[24px]">E-storya</h1>
			<div className="w-[50%] flex flex-col items-center justify-center gap-4">
				<ul className="min-h-50 border border-black p-2 rounded-lg w-full">
					{messages.map((message, i) => {
						return (
							<li key={i} className={cn("p-1", i % 2 === 0 && "bg-gray-300")}>
								{message?.userId === userId ? (
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
