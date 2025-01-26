import { VkGroupEvents } from '../../modules/vk/vk-bot-events.enum';
import { VkGroupChatActionButtonType } from '../../../domain/enums/action-button-types.enum';
import { LongPollingFailedEnum } from '../../modules/vk/vk-bot-long-polling-failed.enum';

export interface GetLongPollEventResponse {
	ts: string;
	failed?: LongPollingFailedEnum;
	updates: GetLongPollEventUpdate[];
}

export interface GetLongPollEventUpdate {
	group_id: number;
	type: VkGroupEvents;
	event_id: string;
	v: string;
	object: GetLongPollEventUpdateObject;
}

export interface GetLongPollEventUpdateObject {
	client_info: GetLongPollEventUpdateObjectClientInfo;
	message: GetLongPollEventUpdateObjectMessage;
}

export interface GetLongPollEventUpdateObjectClientInfo {
	keyboard: boolean;
	inline_keyboard: boolean;
	carousel: boolean;
	lang_id: number;
	button_actions: [];
}

export interface GetLongPollEventUpdateObjectMessage {
	date: number;
	from_id: number;
	id: number;
	version: number;
	out: number;
	fwd_messages: any[];
	important: boolean;
	is_hidden: boolean;
	attachments: any[];
	conversation_message_id: number;
	payload: string;
	text: string;
	peer_id: number;
	random_id: number;
}

export interface GetLongPollEventUpdateObjectMessagePayload {
	command: VkGroupChatActionButtonType;
	text: string;
}