import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib";

import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MenuDialog(props: {
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
}) {
	const { className } = props;

	return (
		<Dialog>
			<DialogTrigger className={cn(className)} asChild>
				<Button variant="ghost">
					<MenuIcon className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
