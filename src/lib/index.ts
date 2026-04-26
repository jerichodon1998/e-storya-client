import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: "http://localhost:3001",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true,
});

export * from "./services";
export * from "./stores";
export * from "./helpers";
export * from "./utils";
