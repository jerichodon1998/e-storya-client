import type { IUser } from "@types";
import { create } from "zustand";
import type { ClientWebSocketService } from "../services";

interface IWebsocketStore {
	websocketChatInstance: ClientWebSocketService | null;
	setWebsocketChatInstance: (
		websocketChatInstance?: ClientWebSocketService | null
	) => void;
}

interface IAppStore {
	user: null | IUser;
	setUser: (user: null | IUser) => void;
}

const useAppStore = create<IAppStore>((set) => ({
	user: null,
	setUser: (user: null | IUser) => set({ user }),
}));

const useWebSocketStore = create<IWebsocketStore>((set) => ({
	websocketChatInstance: null,
	setWebsocketChatInstance: (
		websocketChatInstance?: ClientWebSocketService | null
	) => set({ websocketChatInstance }),
}));

export { useAppStore, useWebSocketStore };
