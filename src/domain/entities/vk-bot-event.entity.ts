import { VkGroupEvents } from '../../infrastructure/modules/vk/vk-bot-events.enum';

export class VkBotEventEntity {
	constructor(
		public eventId: string,
		public eventType: VkGroupEvents,
		public eventApiVersion: string,
		public messageId: number,
		public messageDate: number,
		public messageFromId: number,
		public messagePeerId: number,
		public messagePayload: string,
	) {}
}
