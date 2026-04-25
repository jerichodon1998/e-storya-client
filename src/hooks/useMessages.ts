import { useQuery, useQueryClient } from "@tanstack/react-query";
import { messagesQueryKey } from "src/constants";
import { isEmpty } from "lodash-es";
import { useAuth } from "./useAuth";
import { getMessagesApi } from "src/lib/apis";
import { useMemo } from "react";
import { useParams } from "react-router";
import type { IMessage } from "@types";
import type { AxiosResponse } from "axios";

function useMessages() {
	const queryClient = useQueryClient();

	const params = useParams();

	const channelId = params.channelId;

	const { user } = useAuth();

	const {
		data: messagesDataRes,
		isLoading: messagesDataLoading,
		isError: messagesDataError,
		isFetching: messagesDataFetching,
		refetch: messagesDataRefetch,
	} = useQuery({
		queryKey: [messagesQueryKey, channelId],
		queryFn: () => getMessagesApi({ channelId }),
		enabled: !isEmpty(channelId) && !isEmpty(user),
	});

	const messagesData = useMemo(
		() => messagesDataRes?.data?.messages || [],
		[messagesDataRes]
	);

	const syncNewMessage = (params: { message: IMessage }) => {
		const messageChannelId = params.message.channelId;
		const queryKeyArray = [messagesQueryKey, messageChannelId];
		queryClient.setQueryData(
			queryKeyArray,
			(
				oldData: AxiosResponse<{
					messages: IMessage[];
				}>
			) => {
				const concatinatedMessages = [
					...(oldData?.data?.messages || []),
					params.message,
				];

				return {
					...oldData,
					data: {
						messages: concatinatedMessages,
					},
				} as AxiosResponse<{
					messages: IMessage[];
				}>;
			}
		);
	};

	return {
		messagesData,
		messagesDataRes,
		messagesDataLoading,
		messagesDataError,
		messagesDataFetching,
		messagesDataRefetch,
		syncNewMessage,
	};
}

export { useMessages };
