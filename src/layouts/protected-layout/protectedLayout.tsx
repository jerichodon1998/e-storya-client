import { axiosInstance } from "@lib";
import type { IUser } from "@types";
import { AxiosError } from "axios";
import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/protectedLayout";

// eslint-disable-next-line
export async function loader({ request }: Route.LoaderArgs) {
	const cookieHeader = request.headers.get("cookie");
	const url = new URL(request.url);
	if (url.pathname === "/") {
		return;
	}

	try {
		const response = await axiosInstance.get<{ user?: IUser; error?: any }>(
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
	} catch (error) {
		console.log("error", error?.message?.toString());
		if (error instanceof AxiosError) {
			console.log("error", error.response?.data);
		}

		return redirect("/");
	}
}

export default function ProtectedLayout() {
	return <Outlet />;
}
