import { useWebSocketStore } from "@/lib";
import { useShallow } from "zustand/shallow";
import { useMessages } from "./useMessages";
import type { IChatWebsocketPayloadOnMessage } from "@/types";
import { useChannels } from "./useChannels";

const useChatWebsocket = () => {
	const { syncNewMessage } = useMessages();

	const { syncChannel } = useChannels();

	const { chatWebsocketService, setChatWebsocketService } = useWebSocketStore(
		useShallow((state) => ({
			chatWebsocketService: state.websocketChatInstance,
			setChatWebsocketService: state.setWebsocketChatInstance,
		}))
	);

	const onMessage = (event: Event & { data: string }) => {
		const parsedPayload = JSON.parse(
			event.data
		) as IChatWebsocketPayloadOnMessage;
		if (parsedPayload.message) {
			syncNewMessage({ message: parsedPayload.message });
		}

		if (parsedPayload.channel) {
			syncChannel({
				channel: {
					channel: parsedPayload.channel,
					directMessageChannelMembers:
						parsedPayload.directMessageChannelMembers,
				},
			});
		}
	};

	return { chatWebsocketService, onMessage, setChatWebsocketService };
};

export { useChatWebsocket };
