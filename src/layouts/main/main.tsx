import TopNavigationBar from "@components/topNavigationBar";
import { axiosRestInstance } from "@lib";
import type { IUser } from "@types";
import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/main";
import { AxiosError } from "axios";

// eslint-disable-next-line
export async function loader({ request }: Route.LoaderArgs) {
	const cookieHeader = request.headers.get("cookie");
	const url = new URL(request.url);
	if (url.pathname === "/") {
		return;
	}

	try {
		const response = await axiosRestInstance.get<{ user?: IUser; error?: any }>(
			"/v1/users/signed-in-user",
			{
				headers: {
					cookie: cookieHeader,
				},
			}
		);

		if (response.status >= 400) {
			return redirect("/signin");
		}

		return redirect("/messaging");
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log("error", error.response?.data);
		}

		return;
	}
}

export default function MainLayout() {
	return (
		<div className="h-screen w-full px-20 pt-8 flex flex-col items-center gap-8">
			<TopNavigationBar />
			<Outlet />
		</div>
	);
}
