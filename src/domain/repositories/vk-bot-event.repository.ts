import { VkBotEvent } from '../../infrastructure/db/orm/entities/VkBotEvent.entity';
import { VkGroupEvents } from '../../infrastructure/modules/vk/vk-bot-events.enum';

/**
 * Интерфейс методов репозитория событий vk бота
 */
export interface IVkBotEventRepository {
	/**
	 * Добавление нового события
	 * @param {VkBotEvent} event - Добавляемое событие
	 */
	addEventAsync(event: Partial<VkBotEvent>): Promise<void>;

	/**
	 * Проверка существования события по идентификатору
	 * @param {string} eventId - Идентификатор проверяемого события
	 * @param {VkGroupEvents} eventType - Тип события
	 */
	checkExistsEventAsync(eventId: string, eventType: VkGroupEvents): Promise<boolean>;
}
