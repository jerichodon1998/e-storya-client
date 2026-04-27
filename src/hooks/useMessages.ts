import {
	useInfiniteQuery,
	useQueryClient,
	type InfiniteData,
} from "@tanstack/react-query";
import { messagesQueryKey, messagesSizePerPage } from "src/constants";
import { flatMap, head, isEmpty, last, map, size } from "lodash-es";
import { useAuth } from "./useAuth";
import { getMessagesApi } from "src/lib/apis";
import { useMemo } from "react";
import { useParams } from "react-router";
import type { IMessage } from "@/types";
import type { AxiosResponse } from "axios";

function useMessages() {
	const queryClient = useQueryClient();

	const params = useParams();

	const channelId = params.channelId;

	const { user } = useAuth();

	const {
		data: messagesDataRes,
		isLoading: messagesDataResIsLoading,
		isError: messagesDataResIsError,
		isFetching: messagesDataResIsFetching,
		refetch: messagesDataRefetch,
		fetchNextPage: messagesDataFetchNextPage,
		isSuccess: messagesDataResSuccess,
	} = useInfiniteQuery<
		AxiosResponse<{
			messages?: IMessage[];
			error?: any;
			message?: string;
		}>
	>({
		queryKey: [messagesQueryKey, channelId],
		enabled: !isEmpty(channelId) && !isEmpty(user),
		getNextPageParam: (lastPage) => {
			const lastPageMessages = lastPage?.data?.messages;

			// this indicates that the last query result has less than messagesSizePerPage
			// therefor, this is the last page
			return size(lastPageMessages) === messagesSizePerPage
				? {
						lastSeenMessageId: last(lastPageMessages)?._id,
						lastSeenMessageCreatedAt: last(lastPageMessages)?.createdAt,
						lastSeenMessage: last(lastPageMessages),
					}
				: undefined;
		},
		getPreviousPageParam: (firstPage) => {
			const firstPageMessages = firstPage?.data?.messages;

			return size(firstPageMessages) === messagesSizePerPage
				? {
						lastSeenMessageId: head(firstPageMessages)?._id,
						lastSeenMessageCreatedAt: head(firstPageMessages)?.createdAt,
						lastSeenMessage: head(firstPageMessages),
					}
				: undefined;
		},
		initialPageParam: undefined,
		queryFn: async (params) => {
			const pageParam = params.pageParam as {
				lastSeenMessageId?: string;
				lastSeenMessageCreatedAt?: string | Date;
			};
			const lastSeenMessageId = pageParam?.lastSeenMessageId;
			const lastSeenMessageCreatedAt = pageParam?.lastSeenMessageCreatedAt;

			return await getMessagesApi({
				channelId,
				sizePerPage: messagesSizePerPage,
				...(lastSeenMessageId &&
					lastSeenMessageCreatedAt && {
						lastSeenMessageId,
						lastSeenMessageCreatedAt,
					}),
			});
		},
		staleTime: Infinity,
	});

	const messagesData = useMemo(() => {
		const messages = flatMap(
			map(messagesDataRes?.pages || [], (page) => {
				return map(page?.data?.messages || [], (message) => {
					return message;
				});
			})
		);

		return messages;
	}, [messagesDataRes]);

	// TODO: implement logic for edited/deleted messages
	const syncNewMessage = (params: { message: IMessage }) => {
		const messageChannelId = params.message.channelId;
		const queryKeyArray = [messagesQueryKey, messageChannelId];
		queryClient.setQueryData(
			queryKeyArray,
			(
				oldData: InfiniteData<
					AxiosResponse<{
						messages?: IMessage[];
						error?: any;
						message?: string;
					}>
				>
			): InfiniteData<
				AxiosResponse<{
					messages?: IMessage[];
					error?: any;
					message?: string;
				}>
			> => {
				const { message } = params;
				const pages = oldData?.pages || [];
				/**
				 * TODO: implement logic to add new message to last page if there's still space on last page.
				 * PS: This should be the correct implementation but I encountered a bug in useMemo where the memo doesn't update when the data.messages array
				 * is updated. But will definitely fix this later.
				 */
				// const lastPage = pages[size(pages) - 1];
				// const lastPageCurrentMessagesSize = size(lastPage);
				// const isThereAvailableSlotOnLastPage =
				// 	lastPageCurrentMessagesSize < messagesSizePerPage;

				// if (isThereAvailableSlotOnLastPage) {
				// 	const pagesWithNewMessage = pages;
				// 	pagesWithNewMessage[0] = {
				// 		...lastPage,
				// 		data: { messages: [message, ...lastPage.data.messages] },
				// 	};

				// 	console.log("pagesWithNewMessage", pagesWithNewMessage);

				// 	return {
				// 		...oldData,
				// 		pages: pagesWithNewMessage,
				// 	};
				// }

				const pagesWithNewPageAndNewMessage = [
					...pages,
					{
						...pages[0],
						data: {
							messages: [message],
						},
					},
				];

				return {
					...oldData,
					pages: pagesWithNewPageAndNewMessage,
				};
			}
		);
	};

	return {
		messagesData,
		messagesDataRes,
		messagesDataResSuccess,
		messagesDataResIsLoading,
		messagesDataResIsError,
		messagesDataResIsFetching,
		messagesDataRefetch,
		messagesDataFetchNextPage,
		syncNewMessage,
	};
}

export { useMessages };
