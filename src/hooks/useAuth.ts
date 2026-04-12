import { axiosRestInstance } from "@lib";
import type { IUser } from "@types";
import { useEffect, useState } from "react";

const useAuth = () => {
	const [user, setUser] = useState<IUser | null>(null);

	useEffect(() => {
		axiosRestInstance
			.get<{ user?: IUser; error?: any }>("/v1/users/signed-in-user")
			.then(({ data }) => {
				if (data.user) {
					setUser(data.user);
				}
			})
			.catch((error) => {
				setUser(null);
				console.log("error", error);
			});
	}, []);

	return { user };
};

export { useAuth };
