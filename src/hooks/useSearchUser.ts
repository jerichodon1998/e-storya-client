import { usersSizePerPage } from "@/constants";
import { axiosInstance } from "@/lib";
import type { IUser } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { flatMap, head, isEmpty, last, map, size } from "lodash-es";
import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { useAuth } from "./useAuth";

async function getUsersApi(params: {
	sizePerPage?: number;
	lastSeenUsername?: string;
	searchText: string;
}) {
	const queryParams = new URLSearchParams({
		sizePerPage: params.sizePerPage?.toString(),
		searchText: params.searchText,
		...(params.lastSeenUsername && {
			lastSeenUsername: params.lastSeenUsername,
		}),
	});

	return axiosInstance.get<{
		users?: IUser[] | null | undefined;
		error?: any;
		message?: string | undefined;
	}>(`/v1/users/search?${queryParams}`);
}

export function useSearchUser() {
	const { user } = useAuth();

	const [searchParams] = useSearchParams();

	const searchType = useMemo(
		() => searchParams.get("searchType"),
		[searchParams]
	);

	const searchText = useMemo(
		() => searchParams.get("searchText"),
		[searchParams]
	);

	const {
		data: searchUsersDataRes,
		isLoading: searchUsersDataResIsLoading,
		isError: searchUsersDataResIsError,
		isFetching: searchUsersDataResIsFetching,
		refetch: searchUsersDataRefetch,
		fetchNextPage: searchUsersDataFetchNextPage,
		isSuccess: searchUsersDataResSuccess,
	} = useInfiniteQuery<
		AxiosResponse<{
			users?: IUser[] | null | undefined;
			error?: any;
			message?: string | undefined;
		}>
	>({
		queryKey: [searchType, searchText],
		enabled: !isEmpty(searchText) && !isEmpty(user),
		getNextPageParam: (lastPage) => {
			const lastPageUsers = lastPage?.data?.users;

			return size(lastPageUsers) === usersSizePerPage
				? {
						lastSeenUsername: last(lastPageUsers)?.username,
					}
				: undefined;
		},
		getPreviousPageParam: (firstPage) => {
			const firstPageUsers = firstPage?.data?.users;

			return size(firstPageUsers) === usersSizePerPage
				? {
						lastSeenMessage: head(firstPageUsers)?.username,
					}
				: undefined;
		},
		initialPageParam: undefined,
		queryFn: async (params) => {
			console.log("searchUsersDataRefetch", params.pageParam);

			const pageParam = params.pageParam as {
				lastSeenUsername?: string;
			};

			const lastSeenUsername = pageParam?.lastSeenUsername;

			return await getUsersApi({
				searchText,
				sizePerPage: usersSizePerPage,
				...(!isEmpty(lastSeenUsername) && { lastSeenUsername }),
			});
		},
		staleTime: 30_000,
	});

	const searchUsersData = useMemo(() => {
		const users = flatMap(
			map(searchUsersDataRes?.pages || [], (page) => {
				return map(page?.data?.users || [], (user) => {
					return user;
				});
			})
		);
		console.log("users", users);
		return users;
	}, [searchUsersDataRes]);

	return {
		searchUsersData,
		searchUsersDataRes,
		searchUsersDataResSuccess,
		searchUsersDataResIsLoading,
		searchUsersDataResIsError,
		searchUsersDataResIsFetching,
		searchUsersDataRefetch,
		searchUsersDataFetchNextPage,
		searchText,
		searchType,
	};
}
