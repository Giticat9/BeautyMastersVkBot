import { Injectable } from '@nestjs/common';
import {
	GetLongPollEventUpdate,
	GetLongPollEventUpdateObjectMessagePayload,
} from '../../infrastructure/interfaces/vk/get-long-poll-event-response.interface';
import { VkGroupChatActionButtonType } from '../enums/action-button-types.enum';
import { EventProcessingReturnType } from '../interfaces/event-processing.interface';
import { EventNewMessagePayloadService } from './payloads/event-new-message-payload.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventProcessingService {
	private readonly phoneManicureMaster: string = null;
	private readonly phoneDepilationMaster: string = null;
	private readonly linkSingUpManicure: string = null;
	private readonly linkSingUpDepilation: string = null;

	constructor(private readonly eventNewMessagePayloadService: EventNewMessagePayloadService,
				private readonly configService: ConfigService) {
		this.phoneManicureMaster = configService.get<string>('PHONE_MANICURE_MASTER') ?? '';
		this.phoneDepilationMaster = configService.get<string>('PHONE_DEPILATION_MASTER') ?? '';
		this.linkSingUpManicure = configService.get<string>('LINK_SING_UP_MANICURE') ?? '';
		this.linkSingUpDepilation = configService.get<string>('LINK_SING_UP_DEPILATION') ?? '';
	}

	processNewMessageEvent(event: GetLongPollEventUpdate): EventProcessingReturnType | EventProcessingReturnType[] {
		const { payload } = event?.object?.message;
		if (!payload)
			throw new Error(`(${this.processNewMessageEvent.name}): payload are is missing`);

		const parsedPayload = JSON.parse(payload) as GetLongPollEventUpdateObjectMessagePayload;
		if (!('command' in parsedPayload))
			throw new Error(`(${this.processNewMessageEvent.name}): command is undefined`);

		const startPageKeyboard = this.eventNewMessagePayloadService.getStartActionKeyboard();
		const mastersListPageKeyboard = this.eventNewMessagePayloadService.getMastersListActionKeyboard();
		const selectedManicureMasterInlineActionKeyboard = this.eventNewMessagePayloadService
			.getSelectedMasterInlineActionKeyboard(this.phoneManicureMaster);
		const selectedDepilationMasterInlineActionKeyboard = this.eventNewMessagePayloadService
			.getSelectedMasterInlineActionKeyboard(this.phoneDepilationMaster);
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
					message: 'Федорова Алена\n' +
						'Мастер маникюра, педикюра\n',
					keyboard: selectedManicureMasterInlineActionKeyboard,
				};
			}
			case VkGroupChatActionButtonType.MASTER_DEPILATION: {
				return {
					message: 'Журавлева Анна\n' +
						'Мастер депиляции, SPA-шугаринга\n',
					keyboard: selectedDepilationMasterInlineActionKeyboard,
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
					keyboard: this.eventNewMessagePayloadService.getPriceListInlineActionKeyboard(
						this.linkSingUpManicure,
						this.phoneManicureMaster,
					),
					attachment: 'photo-228884485_456239060',
				};
			}
			case VkGroupChatActionButtonType.PRICE_LIST_PEDICURE: {
				return {
					message: this.eventNewMessagePayloadService.getPriceListPedicureActionMessage(),
					keyboard: this.eventNewMessagePayloadService.getPriceListInlineActionKeyboard(
						this.linkSingUpManicure,
						this.phoneManicureMaster,
					),
					attachment: 'photo-228884485_456239061',
				};
			}
			case VkGroupChatActionButtonType.PRICE_LIST_DEPILATION: {
				return {
					message: this.eventNewMessagePayloadService.getPriceListDepilationActionMessage(),
					keyboard: this.eventNewMessagePayloadService.getPriceListInlineActionKeyboard(
						this.linkSingUpDepilation,
						this.phoneDepilationMaster,
					),
					attachment: 'photo-228884485_456239059',
				};
			}
			case VkGroupChatActionButtonType.SIGN_PROCEDURE: {
				return [
					{
						message: '🔹Для записи, выберите интересующую Вас услугу и нажмите "Записаться" после чего откроется прямая ссылка на страницу.\n' +
							'🔹Если же необходимы уточнения по поводу процедур, нажмите на подходящий для Вас вид связи (WhatsApp, Telegram, Позвонить)\n\n' +
							'📣 Хотим отметить, если мастер не смог ответить сразу, не переживайте! Скорее всего сейчас он занят и обязательно свяжется с Вами в ближайшее время 😊',
					},
					{
						message: 'Запись на процедуры маникюра/педикюра.\n' +
							'Мастер: Федорова Алена\n',
						keyboard: this.eventNewMessagePayloadService.getPriceListInlineActionKeyboard(
							this.linkSingUpManicure,
							this.phoneManicureMaster,
						),
					},
					{
						message: 'Запись на процедуры депиляции/SPA-шугаринга\n' +
							'Мастер: Журавлева Анна\n',
						keyboard: this.eventNewMessagePayloadService.getPriceListInlineActionKeyboard(
							this.linkSingUpDepilation,
							this.phoneDepilationMaster,
						),
					},
				];
			}
			case VkGroupChatActionButtonType.ABOUT_US: {
				return {
					message: this.eventNewMessagePayloadService.getAboutUsActionMessage(),
					attachment: 'photo-228884485_456239024',
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

