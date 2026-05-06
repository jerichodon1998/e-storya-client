import {
	useInfiniteQuery,
	useQueryClient,
	type InfiniteData,
} from "@tanstack/react-query";
import { messagesQueryKey, messagesSizePerPage } from "src/constants";
import { flatMap, head, isEmpty, last, map, size, slice } from "lodash-es";
import { useAuth } from "./useAuth";
import { getMessagesApi } from "src/lib/apis";
import { useMemo } from "react";
import { useParams } from "react-router";
import type { IChatWebsocketPayloadOnMessage, IMessage } from "@/types";
import type { AxiosResponse } from "axios";
import { isValidObjectId, validateDirectMessageUniqueKey } from "@/lib";

type MessagesInfiniteQueryGeneric = InfiniteData<
	AxiosResponse<{
		messages?: IMessage[];
		error?: any;
		message?: string;
	}>
>;

function useMessages() {
	const queryClient = useQueryClient();

	const params = useParams();

	const conversationKey = params.conversationKey;

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
		queryKey: [messagesQueryKey, conversationKey],
		enabled:
			!isEmpty(conversationKey) &&
			!isEmpty(user) &&
			(isValidObjectId(conversationKey) ||
				validateDirectMessageUniqueKey(conversationKey)),
		getNextPageParam: (lastPage) => {
			const lastPageMessages = lastPage?.data?.messages;

			// if the last page has the same size as the messagesSizePerPage,
			// then there's a next page, otherwise it's the last page
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
				conversationKey,
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
	const syncNewMessage = (params: IChatWebsocketPayloadOnMessage) => {
		const payloadConversationKey =
			params?.message?.directMessageUniqueKey ?? params?.message?.channelId;
		const queryKeyArray = [messagesQueryKey, payloadConversationKey];
		queryClient.setQueryData(
			queryKeyArray,
			(oldData: MessagesInfiniteQueryGeneric): MessagesInfiniteQueryGeneric => {
				const { message } = params;
				const pages = oldData?.pages || [];
				const lastPage = last(pages);
				const lastPageCurrentMessagesSize = size(lastPage?.data?.messages);
				const isThereAvailableSlotOnLastPage =
					lastPageCurrentMessagesSize < messagesSizePerPage;

				if (isThereAvailableSlotOnLastPage) {
					const pagesWithNewMessage = [
						...slice(pages, 0, size(pages) - 1),
						{
							...lastPage,
							data: {
								messages: [message, ...(lastPage?.data?.messages ?? [])],
							},
						},
					];

					return {
						...oldData,
						pages: pagesWithNewMessage,
					};
				}

				if (!oldData) {
					const data = {
						pages: [
							{
								data: { messages: [params.message], message: "Success." },
							},
						],
						pageParams: [],
					} as MessagesInfiniteQueryGeneric;
					return data;
				}

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
