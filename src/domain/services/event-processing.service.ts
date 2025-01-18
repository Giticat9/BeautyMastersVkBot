import { Injectable } from '@nestjs/common';
import {
	GetLongPollEventUpdate,
	GetLongPollEventUpdateObjectMessagePayload,
} from '../../infrastructure/interfaces/vk/get-long-poll-event-response.interface';
import { VkGroupChatActionButtonType } from '../enums/action-button-types.enum';
import { EventProcessingReturnType } from '../interfaces/event-processing.interface';
import { EventNewMessagePayloadService } from './payloads/event-new-message-payload.service';

@Injectable()
export class EventProcessingService {
	constructor(private readonly eventNewMessagePayloadService: EventNewMessagePayloadService) {
	}

	processNewMessageEvent(event: GetLongPollEventUpdate): EventProcessingReturnType {
		const { payload } = event?.object?.message;
		if (!payload)
			throw new Error(`(${this.processNewMessageEvent.name}): payload are is missing`);

		const parsedPayload = JSON.parse(payload) as GetLongPollEventUpdateObjectMessagePayload;
		if (!('command' in parsedPayload))
			throw new Error(`(${this.processNewMessageEvent.name}): command is undefined`);

		const command = parsedPayload.command;
		switch (command) {
			case VkGroupChatActionButtonType.START: {
				const keyboard = this.eventNewMessagePayloadService.getStartActionKeyboard();
				return { message: null, keyboard };
			}
			default:
				throw new Error(`(${this.processNewMessageEvent.name}): command with type '${command}' is not implemented`);
		}
	}
}

