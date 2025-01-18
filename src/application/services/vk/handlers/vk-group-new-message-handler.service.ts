import { Injectable } from '@nestjs/common';
import { VKBotEvent } from '../../../../infrastructure/modules/vk/vk-bot-event.decorator';
import { VkGroupEvents } from '../../../../infrastructure/modules/vk/vk-bot-events.enum';

@Injectable()
export class VkGroupNewMessageHandlerService {
	@VKBotEvent(VkGroupEvents.MESSAGE_NEW)
	handleVkGroupNewMessage(data: any) {
		console.log(data);
	}
}