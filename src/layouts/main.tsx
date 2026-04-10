import TopNavigationBar from "@components/topNavigationBar";
import { Outlet } from "react-router";

export default function MainLayout() {
	return (
		<div className="h-screen w-full px-20 pt-8 flex flex-col items-center gap-8">
			<TopNavigationBar />
			<Outlet />
		</div>
	);
}
