import type { IMessage } from ".";

export interface IChatWebsocketPayload {
	message: IMessage;
	directMessageUniqueKey?: string;
}
