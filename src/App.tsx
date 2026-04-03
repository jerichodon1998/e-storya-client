import { useEffect, useRef, useState } from "react";
import "./App.css";
import { cn } from "./lib";
import { createId } from "@paralleldrive/cuid2";

const userId = createId();

function App() {
	const intervalId = useRef(0);
	const backoffDelay = useRef(2_000);
	const isWebsocketConnected = useRef(false);
	const websocket = useRef<WebSocket | null>(null);
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
			websocket.current?.send(data);
		}

		setMessage("");
	}

	function connectWs() {
		console.log("connecting ws");

		const ws = new WebSocket(`ws://localhost:3001/ws?userId=${userId}`);

		ws.onopen = () => {
			console.log("websocket connected");
			isWebsocketConnected.current = true;
			websocket.current = ws;
			clearInterval(intervalId.current);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setMessages((prev) => [...prev, data]);
		};

		ws.onerror = async (event) => {
			isWebsocketConnected.current = false;
			console.log("ws error", event);
		};

		ws.onclose = async (event) => {
			clearInterval(intervalId.current);
			const delay = Math.floor(Math.random() * backoffDelay.current);

			isWebsocketConnected.current = false;
			intervalId.current = setInterval(() => {
				connectWs();
			}, delay);

			if (backoffDelay.current < 60_000) {
				backoffDelay.current = backoffDelay.current + 2000;
			}

			console.log("ws closed", event);
		};
	}

	useEffect(() => {
		if (!websocket.current) {
			connectWs();
		}

		return () => {
			websocket.current?.close();
			websocket.current = null;
			clearInterval(intervalId.current);
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
