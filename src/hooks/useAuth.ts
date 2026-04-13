import { axiosRestInstance, useAppStore } from "@lib";
import type { IUser } from "@types";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const useAuth = () => {
	const { user, setUser } = useAppStore(
		useShallow((state) => ({ user: state.user, setUser: state.setUser }))
	);

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
