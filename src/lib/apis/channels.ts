import { axiosInstance } from "@lib";
import type { IChannel, IPagination } from "@types";

export function getChannelsApi() {
	return axiosInstance.get<{
		channels?: IChannel[] | null | undefined;
		error?: any;
		message?: string;
		pagination?: IPagination | undefined;
	}>(`/v1/channels`);
}
