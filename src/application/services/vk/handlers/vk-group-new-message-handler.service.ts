import { Injectable, Logger } from '@nestjs/common';
import { VKBotEvent } from '../../../../infrastructure/modules/vk/vk-bot-event.decorator';
import { VkGroupEvents } from '../../../../infrastructure/modules/vk/vk-bot-events.enum';
import { GetLongPollEventUpdate } from '../../../../infrastructure/interfaces/vk/get-long-poll-event-response.interface';
import { EventProcessingService } from '../../../../domain/services/event-processing.service';
import { VkBotApiService } from '../../../../infrastructure/modules/vk/vk-bot-api.service';
import { EventProcessingReturnType } from '../../../../domain/interfaces/event-processing.interface';
import { delay } from '../../../../domain/utils/delay.utils';
import { RateLimiterService } from '../../rate-limiter.service';
import { Generator } from '../../../../domain/utils/generator.utils';
import { CheckExistsVkBotEventUseCase } from '../../../use-cases/vk-bot-event/check-exists-vk-bot-event.use-case';
import { AddVkBotEventUseCase } from '../../../use-cases/vk-bot-event/add-vk-bot-event.use-case';

@Injectable()
export class VkGroupNewMessageHandlerService {
	private readonly logger = new Logger(VkGroupNewMessageHandlerService.name);

	constructor(
		private readonly eventProcessingService: EventProcessingService,
		private readonly vkBotApiService: VkBotApiService,
		private readonly rateLimiterService: RateLimiterService,
		private readonly addVkBotEventUseCase: AddVkBotEventUseCase,
		private readonly checkExistsVkBotEventUseCase: CheckExistsVkBotEventUseCase,
	) {}

	@VKBotEvent(VkGroupEvents.MESSAGE_NEW)
	async handleVkGroupNewMessage(event: GetLongPollEventUpdate) {
		try {
			const peerId = event.object.message.peer_id;
			if (!this.rateLimiterService.canProcess(peerId)) {
				this.logger.warn(
					`Слишком много запросов от пользователя ${peerId}. Событие игнорируется.`,
				);
				return;
			}

			const isEventExists = await this.checkExistsVkBotEventUseCase.execute(
				event.event_id,
				VkGroupEvents.MESSAGE_NEW,
			);

			if (!isEventExists) {
				const payloads = this.eventProcessingService.processNewMessageEvent(event);
				if (Array.isArray(payloads) && payloads.length > 0) {
					for (let i = 0; i < payloads.length; i++) {
						const payload = payloads[i];
						await this.processSendMessage(event, payload);
						await delay(500);
					}
				} else if (
					typeof payloads === 'object' &&
					!Array.isArray(payloads) &&
					payloads !== null
				) {
					await this.processSendMessage(event, payloads);
				}

				await this.addVkBotEventUseCase.execute(event, VkGroupEvents.MESSAGE_NEW);
			}
		} catch (error) {
			this.logger.warn(error.message);
		}
	}

	private async processSendMessage(
		event: GetLongPollEventUpdate,
		payload: EventProcessingReturnType,
	) {
		const { message, keyboard, ...rest } = payload;

		const executeParams: Record<string, any> = {
			peer_id: event.object.message.peer_id,
			random_id: Generator.generateRandomId(),
		};

		if (keyboard) executeParams['keyboard'] = JSON.stringify(keyboard);
		if (message) executeParams['message'] = message;

		await this.vkBotApiService.executeApiPostMethod(
			'messages.send',
			Object.assign(executeParams, rest ?? {}),
		);
	}
}
