import { VkBotEvent } from '../orm/entities/VkBotEvent.entity';
import { Injectable } from '@nestjs/common';
import { IVkBotEventRepository } from '../../../domain/repositories/vk-bot-event.repository';
import { TransactionService } from '../orm/transaction-context.service';
import { VkGroupEvents } from '../../modules/vk/vk-bot-events.enum';

@Injectable()
export class VkBotEventRepositoryImpl implements IVkBotEventRepository {
	constructor(private readonly transactionService: TransactionService) {}

	async addEventAsync(event: Partial<VkBotEvent>): Promise<void> {
		return await this.transactionService.executeInTransaction(async queryRunner => {
			await queryRunner.manager.insert(VkBotEvent, event);
		});
	}

	async checkExistsEventAsync(eventId: string, eventType: VkGroupEvents): Promise<boolean> {
		return await this.transactionService.execute(async queryRunner => {
			return await queryRunner.manager.existsBy(VkBotEvent, {
				eventId,
				eventType,
			});
		});
	}
}
