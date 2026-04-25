import { useQuery } from "@tanstack/react-query";
import { channelsQueryKey } from "src/constants";
import { isEmpty } from "lodash-es";
import { useAuth } from "./useAuth";
import { useMemo } from "react";
import { getChannelsApi } from "src/lib/apis";

function useChannels() {
	const { user } = useAuth();

	const {
		data: channelsDataRes,
		isLoading: channelsDataLoading,
		isError: channelsDataError,
		isFetching: channelsDataFetching,
		refetch: channelsDataRefetch,
	} = useQuery({
		queryKey: [channelsQueryKey],
		enabled: !isEmpty(user),
		queryFn: getChannelsApi,
	});

	const channelsData = useMemo(
		() => channelsDataRes?.data?.channels || [],
		[channelsDataRes]
	);

	return {
		channelsData,
		channelsDataRes,
		channelsDataLoading,
		channelsDataError,
		channelsDataFetching,
		channelsDataRefetch,
	};
}

export { useChannels };
