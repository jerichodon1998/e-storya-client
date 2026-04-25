import type { ObjectId } from "bson";
import type {
	ChannelMemberRoleEnum,
	ChannelMemberStatusEnum,
	ChannelTypeEnum,
	MessageTypeEnum,
} from "src/enums";

export interface IUser {
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

export interface IMessage {
	_id: ObjectId | string;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
	deletedAt?: Date;
	userId: ObjectId | string;
	type: MessageTypeEnum;
	channelId: ObjectId | string;
}

export interface IMessage {
	_id: ObjectId | string;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
	deletedAt?: Date;
	userId: ObjectId | string;
	type: MessageTypeEnum;
	channelId: ObjectId | string;
}

export interface IUser {
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

export interface IChannel {
	_id: ObjectId | string;
	createdAt: Date;
	updatedAt?: Date;
	deletedAt?: Date;
	ownerId: ObjectId | string;
	name: string;
	channelType: ChannelTypeEnum;
}

export interface IChannelMember {
	_id: ObjectId | string;
	createdAt: Date;
	updatedAt?: Date;
	deletedAt?: Date;
	role: ChannelMemberRoleEnum;
	status: ChannelMemberStatusEnum;
	userId: ObjectId | string;
	channelId: ObjectId | string;
}

export type ChannelMemberWithUser = IChannelMember & {
	userId: IUser;
};

export interface IPagination {
	page: number;
	sizePerPage: number;
	totalItems: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}
