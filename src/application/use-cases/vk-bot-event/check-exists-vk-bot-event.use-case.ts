import { Inject, Injectable, Logger } from '@nestjs/common';
import { IVkBotEventRepository } from '../../../domain/repositories/vk-bot-event.repository';
import { VkGroupEvents } from '../../../infrastructure/modules/vk/vk-bot-events.enum';

@Injectable()
export class CheckExistsVkBotEventUseCase {
	private readonly logger = new Logger(CheckExistsVkBotEventUseCase.name);

	constructor(
		@Inject('IVkBotEventRepository')
		private readonly vkBotEventRepository: IVkBotEventRepository,
	) {}

	async execute(eventId: string, eventType: VkGroupEvents): Promise<boolean> {
		const isExists = await this.vkBotEventRepository.checkExistsEventAsync(eventId, eventType);

		if (isExists) {
			this.logger.log(`Event with id ${eventId} and type ${eventType} is exists`);
		} else {
			this.logger.log(`Event with id ${eventId} and type ${eventType} is not exists`);
		}

		return isExists;
	}
}
