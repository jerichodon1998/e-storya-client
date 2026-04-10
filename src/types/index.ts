import type { ObjectId } from "bson";

interface IUser {
	_id: ObjectId | string;
	username: string;
	email: string;
	firstName?: string;
	lastName?: string;
	password?: string;
	createdAt: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

export { type IUser };
