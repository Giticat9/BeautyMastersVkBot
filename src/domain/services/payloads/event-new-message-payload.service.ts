import { Injectable } from '@nestjs/common';
import { Serializer } from '../../utils/serializer.utils';
import {
	VkGroupChatOpenLinkButtonDto,
	VkGroupChatTextButtonDto,
	VkGroupMessageDto,
} from '../../dto';
import { VkGroupChatActionButtonType } from '../../enums/action-button-types.enum';
import { VkGroupChatButtonColorEnum } from '../../enums/chat-button-color.enum';

@Injectable()
export class EventNewMessagePayloadService {
	public getStartActionKeyboard() {
		const messageDto = new VkGroupMessageDto();
		messageDto.oneTime = false;
		messageDto.buttons = [
			[
				new VkGroupChatTextButtonDto(
					'Мастера',
					{ command: VkGroupChatActionButtonType.MASTERS_LIST },
					VkGroupChatButtonColorEnum.PRIMARY,
				),
			],
			[
				new VkGroupChatTextButtonDto(
					'Прайс-лист',
					{ command: VkGroupChatActionButtonType.PRICE_LIST },
					VkGroupChatButtonColorEnum.POSITIVE,
				),
				new VkGroupChatTextButtonDto(
					'Записаться',
					{ command: VkGroupChatActionButtonType.SIGN_PROCEDURE },
					VkGroupChatButtonColorEnum.POSITIVE,
				),
			],
			[
				new VkGroupChatTextButtonDto('Рассказать о нас', {
					command: VkGroupChatActionButtonType.ABOUT_US,
				}),
				new VkGroupChatOpenLinkButtonDto(
					'https://yandex.ru/maps/org/a2_mastera_byuti/38639739508/?ll=38.220216%2C55.716697&z=17',
					'Местоположение',
				),
			],
		];

		return Serializer.serialize(messageDto);
	}

	public getMastersListActionKeyboard() {
		const messageDto = new VkGroupMessageDto();
		messageDto.oneTime = false;
		messageDto.buttons = [
			[
				new VkGroupChatTextButtonDto(
					'Мастер маникюра/педикюра',
					{ command: VkGroupChatActionButtonType.MASTER_MANICURE_PEDICURE },
					VkGroupChatButtonColorEnum.PRIMARY,
				),
			],
			[
				new VkGroupChatTextButtonDto(
					'Мастер депиляции/SPA-шугаринга',
					{ command: VkGroupChatActionButtonType.MASTER_DEPILATION },
					VkGroupChatButtonColorEnum.PRIMARY,
				),
			],
			[
				new VkGroupChatTextButtonDto('Назад', {
					command: VkGroupChatActionButtonType.BACK_FROM_MASTERS_LIST,
				}),
			],
		];

		return Serializer.serialize(messageDto);
	}

	public getSelectedMasterInlineActionKeyboard(phoneNumber: string) {
		const messageDto = new VkGroupMessageDto();
		messageDto.oneTime = false;
		messageDto.inline = true;
		messageDto.buttons = [
			[
				new VkGroupChatOpenLinkButtonDto(`https://wa.me/${phoneNumber}`, 'WhatsApp'),
				new VkGroupChatOpenLinkButtonDto(`https://t.me/+${phoneNumber}`, 'Telegram'),
			],
			[new VkGroupChatOpenLinkButtonDto(`tel:+${phoneNumber}`, 'Позвонить')],
		];

		return Serializer.serialize(messageDto);
	}

	public getPriceListActionKeyboard() {
		const messageDto = new VkGroupMessageDto();
		messageDto.oneTime = false;
		messageDto.buttons = [
			[
				new VkGroupChatTextButtonDto(
					'Маникюр',
					{ command: VkGroupChatActionButtonType.PRICE_LIST_MANICURE },
					VkGroupChatButtonColorEnum.PRIMARY,
				),
			],
			[
				new VkGroupChatTextButtonDto(
					'Педикюр',
					{ command: VkGroupChatActionButtonType.PRICE_LIST_PEDICURE },
					VkGroupChatButtonColorEnum.PRIMARY,
				),
			],
			[
				new VkGroupChatTextButtonDto(
					'Депиляция/SPA-шугаринг',
					{ command: VkGroupChatActionButtonType.PRICE_LIST_DEPILATION },
					VkGroupChatButtonColorEnum.PRIMARY,
				),
			],
			[
				new VkGroupChatTextButtonDto('Назад', {
					command: VkGroupChatActionButtonType.BACK_FROM_PRICE_LIST,
				}),
			],
		];

		return Serializer.serialize(messageDto);
	}

	public getPriceListInlineActionKeyboard(link: string, phoneNumber: string) {
		const messageDto = new VkGroupMessageDto();
		messageDto.oneTime = false;
		messageDto.inline = true;
		messageDto.buttons = [
			[new VkGroupChatOpenLinkButtonDto(link, 'Записаться')],
			[
				new VkGroupChatOpenLinkButtonDto(`https://wa.me/${phoneNumber}`, 'WhatsApp'),
				new VkGroupChatOpenLinkButtonDto(`https://t.me/+${phoneNumber}`, 'Telegram'),
			],
			[new VkGroupChatOpenLinkButtonDto(`tel:+${phoneNumber}`, 'Позвонить')],
		];

		return Serializer.serialize(messageDto);
	}

	public getSignUpInlineActionKeyboard(manicureLink: string, depilationLink: string) {
		const messageDto = new VkGroupMessageDto();
		messageDto.oneTime = false;
		messageDto.inline = true;
		messageDto.buttons = [
			[new VkGroupChatOpenLinkButtonDto(manicureLink, 'Маникюр/педикюр')],
			[new VkGroupChatOpenLinkButtonDto(depilationLink, 'Депиляция/SPA-шугаринг')],
		];
	}

	public getPriceListManicureActionMessage() {
		return (
			'💎 Комбинированный маникюр + френч (градиент, лунный френч, кошачий глаз, втирка)\n' +
			'  ➖ Цена: от 1 900 ₽\n' +
			'  ➖ Время: 2 часа\n\n' +
			'💎 Комбинированный маникюр, покрытие + укрепление ногтей\n' +
			'  ➖ Цена: от 1 700 ₽\n' +
			'  ➖ Время: 2 часа\n\n' +
			'💎 Коррекция нарощенных ногтей\n' +
			'  ➖ Цена: от 2 100 ₽\n' +
			'  ➖ Время: 2 часа\n\n' +
			'💎 Маникюр без покрытия\n' +
			'  ➖ Цена: от 800 ₽\n' +
			'  ➖ Время: 1 час\n\n' +
			'💎 Мужской маникюр\n' +
			'  ➖ Цена: от 1 000 ₽\n' +
			'  ➖ Время: 1 час\n\n' +
			'💎 Наращивание ногтей\n' +
			'  ➖ Цена: от 2 600 ₽\n' +
			'  ➖ Время: 3 часа\n'
		);
	}

	public getPriceListPedicureActionMessage() {
		return (
			'💎 Педикюр СМАРТ\n' +
			'  ➖ Цена: от 2 200 ₽\n' +
			'  ➖ Время: 2 часа\n\n' +
			'💎 Педикюр аппаратный комплекс (с обработкой стопы)\n' +
			'  ➖ Цена: от 1 900 ₽\n' +
			'  ➖ Время: 2 часа\n\n' +
			'💎 Педикюр аппаратный комплекс (только пальцы)\n' +
			'  ➖ Цена: от 1 600 ₽\n' +
			'  ➖ Время: 1 час 30 минут\n\n' +
			'💎 Педикюр аппаратный с обработкой стопы (без снятия, без покрытия)\n' +
			'  ➖ Цена: от 1 600 ₽\n' +
			'  ➖ Время: 1 час 30 минут\n\n' +
			'💎 Педикюр аппаратный только пальцы (без снятия, без покрытия)\n' +
			'  ➖ Цена: от 1 400 ₽\n' +
			'  ➖ Время: 1 час\n\n' +
			'💎 Снятие чужого покрытия\n' +
			'  ➖ Цена: уточняется\n'
		);
	}

	public getPriceListDepilationActionMessage() {
		return (
			'💎  Лицо (1 зона)\n' +
			'  ➖ Цена: от 250 ₽\n' +
			'  ➖ Время: 15 минут\n\n' +
			'💎  Спина\n' +
			'  ➖ Цена: от 600 ₽\n' +
			'  ➖ Время: 50 минут\n\n' +
			'💎  Бикини классическое\n' +
			'  ➖ Цена: от 800 ₽\n' +
			'  ➖ Время: 40 минут\n\n' +
			'💎  Веки под бровками\n' +
			'  ➖ Цена: от 300 ₽\n' +
			'  ➖ Время: 15 минут\n\n' +
			'💎  Бикини глубокое\n' +
			'  ➖ Цена: от 1 200 ₽\n' +
			'  ➖ Время: 1 час\n\n' +
			'💎  Живот\n' +
			'  ➖ Цена: от 300 ₽\n' +
			'  ➖ Время: 20 минут\n\n' +
			'💎  Ноги до колена\n' +
			'  ➖ Цена: от 600 ₽\n' +
			'  ➖ Время: 30 минут\n\n' +
			'💎  Ноги выше колена\n' +
			'  ➖ Цена: от 600 ₽\n' +
			'  ➖ Время: 30 минут\n\n' +
			'💎  Ноги полностью\n' +
			'  ➖ Цена: от 1 150 ₽\n' +
			'  ➖ Время: 1 час 20 минут\n\n' +
			'💎  Подмышки\n' +
			'  ➖ Цена: от 350 ₽\n' +
			'  ➖ Время: 20 минут\n\n' +
			'💎  Руки выше локтя\n' +
			'  ➖ Цена: от 600 ₽\n' +
			'  ➖ Время: 30 минут\n\n' +
			'💎  Руки до локтя\n' +
			'  ➖ Цена: от 600 ₽\n' +
			'  ➖ Время: 30 минут\n\n' +
			'💎  Руки полностью\n' +
			'  ➖ Цена: от 1 100 ₽\n' +
			'  ➖ Время: 50 минут\n\n' +
			'💎  Спина мужская\n' +
			'  ➖ Цена: от 1 000 ₽\n' +
			'  ➖ Время: 40 минут\n\n' +
			'💎  Шея, вески\n' +
			'  ➖ Цена: от 450 ₽\n' +
			'  ➖ Время: 30 минут\n\n' +
			'💎  Бёдра\n' +
			'  ➖ Цена: от 600 ₽\n' +
			'  ➖ Время: 45 минут\n\n' +
			'💎 Комплекс: Подмышки + Глубокое бикини + Ноги полностью\n' +
			'  ➖ Цена: от 2 600 ₽\n' +
			'  ➖ Время: 3 часа\n'
		);
	}

	getAboutUsActionMessage() {
		return (
			'Мы занимаемся предоставлением услуг для Вашей красоты.\n' +
			'Основные направления нашей деятельности являются:\n' +
			'🔹 Уход за вашими ноготочками: маникюр, педикюр, покрытие гель-лаком 💅\n' +
			'🔹 Уход за вашей кожей: комплексная депиляция, SPA шугаринг 👯‍♀️\n' +
			'\n' +
			'Почему стоит выбрать именно нас?\n' +
			'\n' +
			'✅ Профессионализм. Мы постоянно повышаем свою квалификацию и следим за тенденциями в индустрии красоты.\n' +
			'✅ Качество. Используем только проверенные материалы, чтобы гарантировать вам наилучший результат.\n' +
			'✅ Комфорт. Создаём для вас комфортные условия во время процедуры.\n' +
			'✅ Безопасность. Весь инструмент проходит регулярную обработку по нормам СанПиН, поэтому вы можете не переживать за своё здоровье.\n' +
			'\n' +
			'Мы постоянно совершенствуемся, чтобы вы всегда оставались довольны результатом. Обещаем, что вам будет комфортно и безопасно 🥰\n' +
			'Скорее записывайтесь на процедурки и доверьте свою красоту нам! 🌸'
		);
	}
}
