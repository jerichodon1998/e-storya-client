import { axiosInstance } from "@/lib";
import type {
	IChannelWithDirectMessageChannelMembers,
	IPagination,
} from "@/types";
import type { ObjectId } from "bson";

export function getChannelsApi(params: {
	lastSeenChannelId?: string | ObjectId;
	sizePerPage?: number;
	lastSeenActivityAt?: string | Date;
}) {
	const { lastSeenChannelId, lastSeenActivityAt, sizePerPage = 20 } = params;

	const queryParams = new URLSearchParams({
		sizePerPage: sizePerPage?.toString(),
		...(lastSeenChannelId && {
			lastSeenChannelId: lastSeenChannelId.toString(),
		}),
		...(lastSeenActivityAt && {
			lastSeenActivityAt: lastSeenActivityAt.toString(),
		}),
	});

	return axiosInstance.get<{
		channels?: IChannelWithDirectMessageChannelMembers[] | null | undefined;
		error?: any;
		message?: string;
		pagination?: IPagination | undefined;
	}>(`/v1/channels?${queryParams.toString()}`);
}
