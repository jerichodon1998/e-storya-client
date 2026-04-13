import { ClientWebSocketService, useWebSocketStore } from "@lib";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const useChatWebsocket = () => {
	const { chatWebsocketService, setChatWebsocketService } = useWebSocketStore(
		useShallow((state) => ({
			chatWebsocketService: state.websocketChatInstance,
			setChatWebsocketService: state.setWebsocketChatInstance,
		}))
	);
	const [messages, setMessages] = useState<
		{ userId: string; content: string }[]
	>([]);

	const sendMessage = useCallback((event) => {
		const data = JSON.parse(event.data);
		console.log("data", data);
		setMessages((prev) => [...prev, data]);
	}, []);

	useEffect(() => {
		const chatWebsocketInstance = new ClientWebSocketService({
			url: "ws://localhost:3001/v1/ws",
			name: "chat app",
			onmessage: sendMessage,
		});

		if (!chatWebsocketService) {
			setChatWebsocketService(chatWebsocketInstance);
		}

		return () => {
			chatWebsocketInstance.close();
			setChatWebsocketService(null);
		};
	}, []);

	return { chatWebsocketService, messages };
};

export { useChatWebsocket };
