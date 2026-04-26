import Channels from "@/components/messages/Channels";
import { Outlet } from "react-router";

function MessagingPage() {
	return (
		<div className="p-4 flex gap-4 h-screen w-screen bg-gray-200">
			<Channels className="flex-1" />
			<div className="flex-5">
				<Outlet />
			</div>
		</div>
	);
}

export default MessagingPage;
