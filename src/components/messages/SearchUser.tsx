import { useSearchUser } from "@/hooks/useSearchUser";
import { cn } from "@/lib";
import { isEmpty, isString, map } from "lodash-es";
import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router";

export default function SearchUser(props: {
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
}) {
	const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

	const searchUsersRef = useRef<HTMLUListElement | null>(null);

	const [_, setSearchParams] = useSearchParams();

	const { className } = props;

	const { searchUsersDataFetchNextPage, searchUsersData, searchText } =
		useSearchUser();

	const [newSearchText, setNewSearchText] = useState(searchText || "");

	const handleScroll = (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
		const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

		const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

		if (atBottom) {
			searchUsersDataFetchNextPage();
		}
	};

	const onSearchUser = (
		e?: React.SubmitEvent<HTMLFormElement>,
		searchText?: string
	) => {
		const finalSearchText = isString(searchText) ? searchText : newSearchText;

		e?.preventDefault();

		setSearchParams({ searchText: finalSearchText });
	};

	const clearSearch = () => {
		clearTimeout(searchDebounceRef.current);
		setNewSearchText("");
		setSearchParams({ searchText: "" });
	};

	useEffect(() => {
		return () => {
			if (searchDebounceRef.current) {
				clearTimeout(searchDebounceRef.current);
			}
		};
	}, []);

	return (
		<div className={cn(className)}>
			<form onSubmit={onSearchUser}>
				<div className="flex gap-1 px-2 py-1 border justify-between border-gray-400 rounded-md w-full">
					<input
						className="focus:outline-none"
						type="text"
						value={newSearchText}
						onChange={(e) => {
							const { value } = e.target;

							setNewSearchText(value);

							clearTimeout(searchDebounceRef.current);

							searchDebounceRef.current = setTimeout(() => {
								onSearchUser(undefined, value || "");
							}, 500);
						}}
					/>
					{isEmpty(newSearchText) ? (
						<Button variant="ghost">
							<SearchIcon className="w-4 h-4" />
						</Button>
					) : (
						<Button variant="ghost" type="button" onClick={clearSearch}>
							<XIcon className="w-4 h-4" />
						</Button>
					)}
				</div>
			</form>
			{!isEmpty(searchUsersData) && (
				<ul
					className="overflow-y-scroll flex flex-col gap-4 px-4 py-2 max-h-100 border w-75 border-gray-400 bg-gray-300 rounded-sm shadow-sm mt-1 absolute"
					ref={searchUsersRef}
					onScroll={handleScroll}
				>
					{map(searchUsersData, (users, i) => {
						const itemKey = `${users._id}-${i}`;

						return (
							<li
								key={itemKey}
								className="w-full hover:bg-gray-200 p-2 rounded cursor-pointer"
							>
								<h1 className="font-bold text-sm">{users.username}</h1>
								<p className="font-light text-xs ">{users.email}</p>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
