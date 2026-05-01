import ChatBox from "@/components/messages/ChatBox";
import type { Route } from "./+types/chatBoxPage";
import { isValidObjectId, validateDirectMessageUniqueKey } from "@/lib";
import { redirect } from "react-router";

export function loader({ params }: Route.LoaderArgs) {
	const { conversationKey } = params;

	if (
		!isValidObjectId(conversationKey) &&
		!validateDirectMessageUniqueKey(conversationKey)
	) {
		return redirect("/messaging");
	}
}

export default function ChatBoxPage() {
	return <ChatBox className="flex-1" />;
}
