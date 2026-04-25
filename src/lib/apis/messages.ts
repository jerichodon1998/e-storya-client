import { axiosInstance, isValidObjectId } from "@lib";
import type { IMessage } from "@types";
import { AxiosError } from "axios";

export function getMessagesApi(params: {
	channelId: string;
	sizePerPage?: number;
	lastSeenMessageId?: string;
	lastSeenMessageCreatedAt?: string | Date;
}) {
	const {
		channelId,
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
				lastSeenMessageId,
				lastSeenMessageCreatedAt: lastSeenMessageCreatedAt.toString(),
			}),
	});

	return axiosInstance.get<{
		messages?: IMessage[] | null | undefined;
		error?: any;
		message?: string | undefined;
	}>(`/v1/messages/${channelId}?${queryParams.toString()}`);
}
