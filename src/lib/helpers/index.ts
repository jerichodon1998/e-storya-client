import type { IMessage } from "@/types";
import { ObjectId } from "bson";
import { orderBy } from "lodash-es";

/**
 * Is valid object id.
 *
 * @param {string} id
 * @return {boolean}
 */
export function isValidObjectId(id: string | Record<string, any>): boolean {
	return ObjectId.isValid(id?.toString());
}

/**
 * Sort messages.
 *
 * @param {IMessage[]} params.messages
 * @param {'asc'|'desc'} params.order - default 'asc'
 * @return {IMessage[]}
 */
export function sortMessages(params: {
	messages: IMessage[];
	order?: "asc" | "desc";
}): IMessage[] {
	const { messages, order = "asc" } = params;

	return orderBy(messages, ["createdAt", "_id"], [order, order]);
}
