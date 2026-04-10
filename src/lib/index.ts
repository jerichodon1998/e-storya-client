import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const axiosRestInstance = axios.create({
	baseURL: "http://localhost:3001",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true,
});

export { ClientWebSocketService } from "./services";
