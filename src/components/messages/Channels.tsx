import { cn } from "@lib";
import { Link, useNavigate, useParams } from "react-router";
import { head, map } from "lodash-es";
import { useChannels } from "@hooks/useChannels";
import { useEffect } from "react";

export default function Channels(props: {
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
}) {
	const navigate = useNavigate();

	const { channelId } = useParams();

	const { className } = props;

	const { channelsData } = useChannels();

	useEffect(() => {
		if (!channelId && head(channelsData)) {
			navigate(`/messaging/${channelsData[0]?._id}`, { replace: true });
		}
	}, [channelsData]);

	return (
		<div
			className={cn(
				"flex flex-col gap-2 p-2 shadow-md bg-gray-300 rounded-lg h-full",
				className
			)}
		>
			<h1>CHANNELS</h1>
			<div
				id="messageBody"
				className="overflow-y-scroll pr-1 h-[98%] box-border"
			>
				<ul className="flex flex-col grow gap-2">
					{map(channelsData, (channel, i) => {
						return (
							<Link
								key={`${channel._id}-${i}`}
								to={`/messaging/${channel._id}`}
								className={cn(
									"py-1 px-2 hover:bg-gray-400 rounded-lg w-full",
									channel._id === channelId && "bg-gray-400"
								)}
							>
								{channel?.name}
							</Link>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
