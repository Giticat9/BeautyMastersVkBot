import { Injectable, Logger } from '@nestjs/common';
import { VKBotEvent } from '../../../../infrastructure/modules/vk/vk-bot-event.decorator';
import { VkGroupEvents } from '../../../../infrastructure/modules/vk/vk-bot-events.enum';
import {
	GetLongPollEventUpdate,
} from '../../../../infrastructure/interfaces/vk/get-long-poll-event-response.interface';
import { EventProcessingService } from '../../../../domain/services/event-processing.service';
import { VkBotApiService } from '../../../../infrastructure/modules/vk/vk-bot-api.service';
import { EventProcessingReturnType } from '../../../../domain/interfaces/event-processing.interface';

@Injectable()
export class VkGroupNewMessageHandlerService {
	private readonly logger = new Logger(VkGroupNewMessageHandlerService.name);

	constructor(private readonly eventProcessingService: EventProcessingService,
				private readonly vkBotApiService: VkBotApiService) {
	}

	@VKBotEvent(VkGroupEvents.MESSAGE_NEW)
	async handleVkGroupNewMessage(event: GetLongPollEventUpdate) {
		try {
			const payloads = this.eventProcessingService.processNewMessageEvent(event);
			if (Array.isArray(payloads) && payloads.length > 0) {
				for (let i = 0; i < payloads.length; i++) {
					const payload = payloads[i];
					await this.processSendMessage(event, payload);
				}
			} else if (typeof payloads === 'object' && !Array.isArray(payloads) && payloads !== null) {
				await this.processSendMessage(event, payloads);
			}
		} catch (error) {
			this.logger.warn(error.message);
		}
	}

	private async processSendMessage(event: GetLongPollEventUpdate, payload: EventProcessingReturnType) {
		const { message, keyboard, ...rest } = payload;

		const executeParams: Record<string, any> = {
			peer_id: event.object.message.peer_id,
			random_id: 0,
		};

		if (keyboard) executeParams['keyboard'] = JSON.stringify(keyboard);
		if (message) executeParams['message'] = message;

		const result = await this.vkBotApiService
			.executeApiPostMethod('messages.send', Object.assign(executeParams, rest ?? {}));
		console.log(event, result);
	}
}