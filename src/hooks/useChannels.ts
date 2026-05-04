import {
	useInfiniteQuery,
	useQueryClient,
	type InfiniteData,
} from "@tanstack/react-query";
import { channelsQueryKey, channelsSizePerPage } from "src/constants";
import { filter, flatMap, head, isEmpty, last, map, size } from "lodash-es";
import { useAuth } from "./useAuth";
import { useMemo } from "react";
import { getChannelsApi } from "src/lib/apis";
import type { AxiosResponse } from "axios";
import type {
	IChannelWithDirectMessageChannelMembers,
	IPagination,
} from "@/types";
import { sortChannels } from "@/lib";

function useChannels() {
	const queryClient = useQueryClient();

	const { user } = useAuth();

	const {
		data: channelsDataRes,
		isLoading: channelsDataLoading,
		isError: channelsDataError,
		isFetching: channelsDataFetching,
		refetch: channelsDataRefetch,
		fetchNextPage: channelsDataFetchNextPage,
		isSuccess: channelsDataResSuccess,
	} = useInfiniteQuery<
		AxiosResponse<{
			channels?: IChannelWithDirectMessageChannelMembers[] | null | undefined;
			error?: any;
			message?: string;
			pagination?: IPagination | undefined;
		}>
	>({
		queryKey: [channelsQueryKey],
		enabled: !isEmpty(user),
		getNextPageParam: (lastPage) => {
			const lastPageMessages = lastPage?.data?.channels;

			return size(lastPageMessages) === channelsSizePerPage
				? {
						lastSeenActivityAt: last(lastPageMessages)?.channel?.lastActivityAt,
						lastSeenChannelId: last(lastPageMessages)?.channel?._id,
					}
				: undefined;
		},
		getPreviousPageParam: (firstPage) => {
			const firstPageChannels = firstPage?.data?.channels;

			return size(firstPageChannels) === channelsSizePerPage
				? {
						lastSeenActivityAt:
							head(firstPageChannels)?.channel?.lastActivityAt,
						lastSeenChannelId: head(firstPageChannels)?.channel?._id,
					}
				: undefined;
		},
		initialPageParam: undefined,
		queryFn: async (params) => {
			const pageParam = params.pageParam as {
				lastSeenActivityAt?: string;
				lastSeenChannelId?: string;
			};
			const lastSeenActivityAt = pageParam?.lastSeenActivityAt;
			const lastSeenChannelId = pageParam?.lastSeenChannelId;

			return await getChannelsApi({
				...(lastSeenActivityAt &&
					lastSeenChannelId && {
						lastSeenActivityAt,
						lastSeenChannelId,
					}),
				sizePerPage: channelsSizePerPage,
			});
		},
		staleTime: Infinity,
	});

	const channelsData = useMemo(() => {
		const channels = flatMap(
			map(channelsDataRes?.pages || [], (page) => {
				return map(page?.data?.channels || [], (channel) => {
					return channel;
				});
			})
		);

		return sortChannels({ channels, order: "desc" });
	}, [channelsDataRes]);

	const syncChannel = (params: {
		channel: IChannelWithDirectMessageChannelMembers;
	}) => {
		const queryKeyArray = [channelsQueryKey];

		queryClient.setQueryData(
			queryKeyArray,
			(
				oldData: InfiniteData<
					AxiosResponse<{
						channels?:
							| IChannelWithDirectMessageChannelMembers[]
							| null
							| undefined;
						error?: any;
						message?: string;
						pagination?: IPagination | undefined;
					}>
				>
			): InfiniteData<
				AxiosResponse<{
					channels?:
						| IChannelWithDirectMessageChannelMembers[]
						| null
						| undefined;
					error?: any;
					message?: string;
					pagination?: IPagination | undefined;
				}>
			> => {
				const { channel } = params;
				const pages = oldData?.pages || [];

				const channelId = channel?.channel?._id?.toString();

				const pagesWithPoppedOutChannel = map(pages, (page) => {
					return {
						...page,
						data: {
							channels: filter(page.data.channels, (channel) => {
								return channel?.channel?._id?.toString() !== channelId;
							}),
						},
					};
				});

				const pagesWithNewPageAndUpdatedChannels = [
					...pagesWithPoppedOutChannel,
					{
						...pagesWithPoppedOutChannel?.[0],
						data: {
							channels: [channel],
						},
					},
				];

				return {
					...oldData,
					pages: pagesWithNewPageAndUpdatedChannels,
				};
			}
		);
	};

	return {
		channelsData,
		channelsDataRes,
		channelsDataLoading,
		channelsDataError,
		channelsDataFetching,
		channelsDataResSuccess,
		channelsDataRefetch,
		channelsDataFetchNextPage,
		syncChannel,
	};
}

export { useChannels };
