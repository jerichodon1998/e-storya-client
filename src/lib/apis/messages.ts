import { axiosInstance, isValidObjectId } from "@/lib";
import type { IMessage } from "@/types";
import { AxiosError } from "axios";
import type { ObjectId } from "bson";

/**
 * Get Messages api
 * - cursor based query.
 *
 * @param {string} params.conversationKey - It's either a channelId or a directMessageUniqueKey.
 * @param {number} params.sizePerPage
 * @param {string | ObjectId} params.lastSeenMessageId
 * @param {string | Date} params.lastSeenMessageCreatedAt
 * @return {Promise<AxiosResponse<{ messages: IMessage[], error: any, message: string }>>}
 */
export function getMessagesApi(params: {
	conversationKey: string;
	sizePerPage?: number;
	lastSeenMessageId?: string | ObjectId;
	lastSeenMessageCreatedAt?: string | Date;
}) {
	const {
		conversationKey,
		sizePerPage = 20,
		lastSeenMessageId,
		lastSeenMessageCreatedAt,
	} = params;

	if (!isValidObjectId) {
		throw new AxiosError("Invalid channelId", "400");
	}

	const queryParams = new URLSearchParams({
		sizePerPage: sizePerPage?.toString(),
		...(lastSeenMessageId &&
			lastSeenMessageCreatedAt && {
				lastSeenMessageId: lastSeenMessageId.toString(),
				lastSeenMessageCreatedAt: lastSeenMessageCreatedAt.toString(),
			}),
	});

	return axiosInstance.get<{
		messages?: IMessage[] | null | undefined;
		error?: any;
		message?: string | undefined;
	}>(`/v1/messages/${conversationKey}?${queryParams.toString()}`);
}
