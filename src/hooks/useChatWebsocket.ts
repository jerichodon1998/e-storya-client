import { ClientWebSocketService } from "@lib";
import { useEffect, useRef, useState } from "react";

const useChatWebsocket = () => {
	const chatWebsocketService = useRef<ClientWebSocketService | null>(null);
	const [messages, setMessages] = useState<
		{ userId: string; content: string }[]
	>([]);

	useEffect(() => {
		if (!chatWebsocketService.current) {
			chatWebsocketService.current = new ClientWebSocketService({
				url: "ws://localhost:3001/v1/ws",
				name: "chat app",
				onmessage: (event) => {
					const data = JSON.parse(event.data);
					console.log("data", data);
					setMessages((prev) => [...prev, data]);
				},
			});
		}

		return () => {
			clearInterval(chatWebsocketService.current?.intervalId);
			chatWebsocketService.current?.close();
			chatWebsocketService.current = null;
		};
	}, []);

	return { chatWebsocketService, messages };
};

export { useChatWebsocket };
