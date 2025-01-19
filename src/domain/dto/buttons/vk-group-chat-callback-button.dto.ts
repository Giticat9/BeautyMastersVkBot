import { VkGroupChatButtonTypeEnum } from '../../enums/chat-button-type.enum';
import { SerializedName } from '../../decorators/serialized-name.decorator';
import { VkGroupChatButtonAbstractDto } from './vk-group-chat-abstract-button.dto';

class VkGroupChatCallbackButtonActionDto implements VkGroupChatButtonAbstractDto {
	@SerializedName('type')
	public readonly type: VkGroupChatButtonTypeEnum = VkGroupChatButtonTypeEnum.CALLBACK;

	@SerializedName('label')
	public label: string = null;

	@SerializedName('payload')
	public payload?: object = null;

	constructor(label: string, payload?: object) {
		this.label = label;
		this.payload = payload;
	}
}

export class VkGroupChatCallbackButtonDto {
	@SerializedName('action')
	public action: VkGroupChatCallbackButtonActionDto = null;

	constructor(label: string, payload?: object) {
		this.action = new VkGroupChatCallbackButtonActionDto(label, payload);
	}
}