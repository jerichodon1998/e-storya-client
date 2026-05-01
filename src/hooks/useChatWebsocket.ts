import { useWebSocketStore } from "@/lib";
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

	return { chatWebsocketService, onMessage, setChatWebsocketService };
};

export { useChatWebsocket };
