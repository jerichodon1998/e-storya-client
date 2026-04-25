import { ClientWebSocketService, useWebSocketStore } from "@lib";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useMessages } from "./useMessages";

const useChatWebsocket = () => {
	const { syncNewMessage } = useMessages();

	const { chatWebsocketService, setChatWebsocketService } = useWebSocketStore(
		useShallow((state) => ({
			chatWebsocketService: state.websocketChatInstance,
			setChatWebsocketService: state.setWebsocketChatInstance,
		}))
	);

	const onMessage = (event: Event & { data: string }) => {
		const parsedMessage = JSON.parse(event.data);
		syncNewMessage({ message: parsedMessage });
	};

	useEffect(() => {
		const chatWebsocketInstance = new ClientWebSocketService({
			url: "ws://localhost:3001/v1/ws",
			name: "chat app",
			onmessage: onMessage,
		});

		if (!chatWebsocketService) {
			setChatWebsocketService(chatWebsocketInstance);
		}

		return () => {
			chatWebsocketInstance.close();
			setChatWebsocketService(null);
		};
	}, []);

	return { chatWebsocketService };
};

export { useChatWebsocket };
