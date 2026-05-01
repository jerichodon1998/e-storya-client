import type { IMessage } from "@/types";
import { ObjectId } from "bson";
import { isEmpty, isString, orderBy } from "lodash-es";

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

/**
 * Get direct message unique key.
 *
 * @param {(string | ObjectId)[]} ids
 * @return {string} directMessageUniqueKey
 */
export function getDirectMessageUniqueKey(
	ids: [string | ObjectId, string | ObjectId]
): string {
	if (ids.length !== 2 || !Array.isArray(ids)) {
		throw new Error("getDirectMessageUniqueKey() ids must be of length 2.");
	}

	const id1 = ids[0];
	const id2 = ids[1];

	if (!isValidObjectId(id1) || !isValidObjectId(id2)) {
		throw new Error("getDirectMessageUniqueKey() Invalid objectId");
	}

	return [id1.toString(), id2.toString()].sort().join("-");
}

/**
 * Validates the direct message unique key.
 *
 * @param {string} directMessageUniqueKey
 * @return {boolean}
 */
export function validateDirectMessageUniqueKey(
	directMessageUniqueKey: string
): boolean {
	if (isEmpty(directMessageUniqueKey) || !isString(directMessageUniqueKey)) {
		return false;
	}

	const directMessageUniqueKeyArray = directMessageUniqueKey.split("-");

	if (directMessageUniqueKeyArray.length !== 2) {
		return false;
	}

	const userId1 = directMessageUniqueKeyArray[0];
	const userId2 = directMessageUniqueKeyArray[1];

	if (!isValidObjectId(userId1) || !isValidObjectId(userId2)) {
		return false;
	}

	return true;
}
