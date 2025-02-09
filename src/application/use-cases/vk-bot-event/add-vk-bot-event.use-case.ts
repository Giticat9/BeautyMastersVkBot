import { Inject, Injectable, Logger } from '@nestjs/common';
import { IVkBotEventRepository } from '../../../domain/repositories/vk-bot-event.repository';
import { GetLongPollEventUpdate } from '../../../infrastructure/interfaces/vk/get-long-poll-event-response.interface';
import { VkBotEventEntity } from '../../../domain/entities/vk-bot-event.entity';
import { VkGroupEvents } from '../../../infrastructure/modules/vk/vk-bot-events.enum';

@Injectable()
export class AddVkBotEventUseCase {
	private readonly logger = new Logger(AddVkBotEventUseCase.name);

	constructor(
		@Inject('IVkBotEventRepository')
		private readonly vkBotEventRepository: IVkBotEventRepository,
	) {}

	async execute(longPollEvent: GetLongPollEventUpdate, eventType: VkGroupEvents): Promise<void> {
		const message = longPollEvent.object.message;

		const event = new VkBotEventEntity(
			longPollEvent.event_id,
			eventType,
			longPollEvent.v,
			message.id,
			message.date,
			message.from_id,
			message.peer_id,
			message.payload,
		);

		await this.vkBotEventRepository.addEventAsync(event);
		this.logger.log(`event with id ${event.eventId} is inserted successfully.`);
	}
}
