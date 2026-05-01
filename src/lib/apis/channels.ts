import { axiosInstance } from "@/lib";
import type {
	IChannelWithDirectMessageChannelMembers,
	IPagination,
} from "@/types";

export function getChannelsApi() {
	return axiosInstance.get<{
		channels?: IChannelWithDirectMessageChannelMembers[] | null | undefined;
		error?: any;
		message?: string;
		pagination?: IPagination | undefined;
	}>(`/v1/channels`);
}
