import { Injectable } from '@nestjs/common';
import {
	VkGroupMessageButtonActionDto,
	VkGroupMessageButtonActionPayloadDto,
	VkGroupMessageButtonDto,
	VkGroupMessageDto,
} from '../../dto/vk-group-message.dto';
import { VkGroupChatActionButtonType } from '../../enums/action-button-types.enum';
import { Serializer } from '../../utils/serializer.utils';

@Injectable()
export class EventNewMessagePayloadService {
	public getStartActionKeyboard() {
		const messageDto = new VkGroupMessageDto();
		messageDto.oneTime = false;
		messageDto.buttons = [
			[
				new VkGroupMessageButtonDto(
					new VkGroupMessageButtonActionDto(
						'text',
						'О нас',
						new VkGroupMessageButtonActionPayloadDto(VkGroupChatActionButtonType.ABOUT_US),
					),
				),
			],
		];

		return Serializer.serialize(messageDto);
	}
}