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

		const startPageKeyboard = this.eventNewMessagePayloadService.getStartActionKeyboard();
		const mastersListPageKeyboard = this.eventNewMessagePayloadService.getMastersListActionKeyboard();
		const selectedManicureMasterInlineActionKeyboard = this.eventNewMessagePayloadService
			.getSelectedMasterInlineActionKeyboard('79019086304');
		const selectedDepilationMasterInlineActionKeyboard = this.eventNewMessagePayloadService
			.getSelectedMasterInlineActionKeyboard('79019086304');
		const priceListPageKeyboard = this.eventNewMessagePayloadService.getPriceListActionKeyboard();

		const command = parsedPayload.command;
		switch (command) {
			case VkGroupChatActionButtonType.START: {
				return { message: 'Выберите что Вас интересует.', keyboard: startPageKeyboard };
			}
			case VkGroupChatActionButtonType.MASTERS_LIST: {
				return {
					message: 'Выберите мастера, про которого хотите узнать.',
					keyboard: mastersListPageKeyboard,
				};
			}
			case VkGroupChatActionButtonType.MASTER_MANICURE_PEDICURE: {
				return {
					message: '+',
					keyboard: selectedManicureMasterInlineActionKeyboard
				};
			}
			case VkGroupChatActionButtonType.MASTER_DEPILATION: {
				return {
					message: '+',
					keyboard: selectedDepilationMasterInlineActionKeyboard
				};
			}
			case VkGroupChatActionButtonType.PRICE_LIST: {
				return {
					message: 'Выберите услуги, на которую хотите получить прайс-лист.',
					keyboard: priceListPageKeyboard,
				};
			}
			case VkGroupChatActionButtonType.PRICE_LIST_MANICURE: {
				return {
					message: this.eventNewMessagePayloadService.getPriceListManicureActionMessage(),
					attachment: 'photo-228884485_456239060',
				};
			}
			case VkGroupChatActionButtonType.PRICE_LIST_PEDICURE: {
				return {
					message: this.eventNewMessagePayloadService.getPriceListPedicureActionMessage(),
					attachment: 'photo-228884485_456239061',
				};
			}
			case VkGroupChatActionButtonType.PRICE_LIST_DEPILATION: {
				return {
					message: this.eventNewMessagePayloadService.getPriceListDepilationActionMessage(),
					attachment: 'photo-228884485_456239059',
				};
			}
			case VkGroupChatActionButtonType.BACK_FROM_MASTERS_LIST:
			case VkGroupChatActionButtonType.BACK_FROM_PRICE_LIST: {
				return { message: 'Выберите что Вас интересует.', keyboard: startPageKeyboard };
			}
			default:
				throw new Error(`(${this.processNewMessageEvent.name}): command with type '${command}' is not implemented`);
		}
	}
}

