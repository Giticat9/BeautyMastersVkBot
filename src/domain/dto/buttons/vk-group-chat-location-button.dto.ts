import { VkGroupChatButtonTypeEnum } from '../../enums/chat-button-type.enum';
import { VkGroupChatButtonAbstractDto } from './vk-group-chat-abstract-button.dto';
import { SerializedName } from '../../decorators/serialized-name.decorator';

class VkGroupChatLocationButtonActionDto implements VkGroupChatButtonAbstractDto {
	@SerializedName('type')
	public readonly type: VkGroupChatButtonTypeEnum = VkGroupChatButtonTypeEnum.LOCATION;

	@SerializedName('payload')
	public payload?: object = null;

	constructor(payload?: object) {
		this.payload = payload;
	}
}

export class VkGroupChatLocationButtonDto {
	@SerializedName('action')
	public action: VkGroupChatLocationButtonActionDto = null;

	constructor(payload?: object) {
		this.action = new VkGroupChatLocationButtonActionDto(payload);
	}
}