import { Injectable, Logger } from '@nestjs/common';
import { VKBotEvent } from '../../../../infrastructure/modules/vk/vk-bot-event.decorator';
import { VkGroupEvents } from '../../../../infrastructure/modules/vk/vk-bot-events.enum';
import {
	GetLongPollEventUpdate,
} from '../../../../infrastructure/interfaces/vk/get-long-poll-event-response.interface';
import { EventProcessingService } from '../../../../domain/services/event-processing.service';
import { VkBotApiService } from '../../../../infrastructure/modules/vk/vk-bot-api.service';

@Injectable()
export class VkGroupNewMessageHandlerService {
	private readonly logger = new Logger(VkGroupNewMessageHandlerService.name);

	constructor(private readonly eventProcessingService: EventProcessingService,
				private readonly vkBotApiService: VkBotApiService) {
	}

	@VKBotEvent(VkGroupEvents.MESSAGE_NEW)
	async handleVkGroupNewMessage(event: GetLongPollEventUpdate) {
		try {
			const eventPayload = this.eventProcessingService.processNewMessageEvent(event);
			const result = await this.vkBotApiService.executeApiPostMethod('messages.send', {
				peer_id: event.object.message.peer_id,
				random_id: 0,
				keyboard: JSON.stringify(eventPayload.keyboard),
				message: eventPayload.message,
			});

			console.log(result);
		} catch (error) {
			this.logger.warn(error.message);
		}
	}
}