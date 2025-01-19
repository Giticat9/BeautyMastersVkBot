import { SerializedName } from '../../decorators/serialized-name.decorator';
import { VkGroupChatButtonTypeEnum } from '../../enums/chat-button-type.enum';
import { VkGroupChatButtonAbstractDto } from './vk-group-chat-abstract-button.dto';
import { VkGroupChatButtonColorEnum } from '../../enums/chat-button-color.enum';

class VkGroupChatTextButtonActionDto implements VkGroupChatButtonAbstractDto {
	@SerializedName('type')
	public type: VkGroupChatButtonTypeEnum = VkGroupChatButtonTypeEnum.TEXT;

	@SerializedName('label')
	public label: string = null;

	@SerializedName('payload')
	public payload?: object = null;

	constructor(label: string, payload?: object) {
		this.label = label;
		this.payload = payload;
	}
}

export class VkGroupChatTextButtonDto {
	@SerializedName('color')
	public color: VkGroupChatButtonColorEnum = null;

	@SerializedName('action')
	public action: VkGroupChatTextButtonActionDto = null;

	constructor(label: string, payload?: object, color?: VkGroupChatButtonColorEnum) {
		this.color = color;
		this.action = new VkGroupChatTextButtonActionDto(label, payload);
	}
}