import type { WebSocketEvents } from "@/enums";
import type {
	ChannelMemberWithUser,
	IChannel,
	IChannelMember,
	IMessage,
} from ".";

export type IChatWebsocketPayloadOnSend = {
	event: WebSocketEvents;
	message?: Partial<IMessage>;
	channel?: Partial<IChannel>;
	channelMember?: Partial<IChannelMember>;
	directMessageUniqueKey?: string;
};

export type IChatWebsocketPayloadOnMessage = {
	event: WebSocketEvents;
	message?: IMessage;
	channel?: IChannel;
	channelMember?: IChannelMember;
	directMessageChannelMembers?: ChannelMemberWithUser[] | null | undefined;
};
