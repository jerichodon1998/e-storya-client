import { cn } from "@/lib";
import { Link, useNavigate, useParams } from "react-router";
import { filter, head, map } from "lodash-es";
import { useChannels } from "@/hooks/useChannels";
import { useEffect } from "react";

import SearchUser from "./SearchUser";
import { ChannelTypeEnum } from "@/enums";
import { useAuth } from "@/hooks";

export default function SideNavigation(props: {
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
}) {
	const navigate = useNavigate();

	const { user } = useAuth();

	const { channelId } = useParams();

	const { className } = props;

	const { channelsData } = useChannels();

	useEffect(() => {
		if (!channelId && head(channelsData)) {
			navigate(`/messaging/${channelsData[0]?.channel?._id}`, {
				replace: true,
			});
		}
	}, [channelsData]);

	return (
		<div
			className={cn(
				"flex flex-col gap-2 p-2 border border-gray-400 shadow bg-gray-300 rounded-lg h-full",
				className
			)}
		>
			<div className="flex justify-between items-center px-1">
				<h1>Chats</h1>
			</div>
			<SearchUser className="pr-3" />
			<div
				id="messageBody"
				className="overflow-y-scroll pr-1 h-[98%] box-border"
			>
				<ul className="flex flex-col grow gap-2">
					{map(channelsData, (channel, i) => {
						const isDirectMessage =
							channel.channel.channelType === ChannelTypeEnum.DIRECT_MESSAGE;
						const otherUser = head(
							filter(
								channel.directMessageChannelMembers,
								(member) => member.userId._id !== user?._id
							)
						);
						const channelName = isDirectMessage
							? otherUser?.userId?.username
							: channel.channel.name;

						return (
							<Link
								key={`${channel?.channel._id}-${i}`}
								to={`/messaging/${channel.channel._id}`}
								className={cn(
									"py-1 px-2 hover:bg-gray-400 rounded-lg w-full",
									channel.channel._id === channelId && "bg-gray-400"
								)}
							>
								{channelName}
							</Link>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
