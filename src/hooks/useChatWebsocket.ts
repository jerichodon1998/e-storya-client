import { ClientWebSocketService } from "@lib/services/websocketService";
import { ObjectId } from "bson";
import { useEffect, useRef, useState } from "react";

const userId = new ObjectId();

const useChatWebsocket = () => {
	const chatWebsocketService = useRef<ClientWebSocketService | null>(null);
	const [messages, setMessages] = useState<
		{ userId: string; content: string }[]
	>([]);

	useEffect(() => {
		if (!chatWebsocketService.current) {
			chatWebsocketService.current = new ClientWebSocketService({
				url: "ws://localhost:3001/ws",
				name: "chat app",
				userId,
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

	return { chatWebsocketService, messages, userId };
};

export { useChatWebsocket };
