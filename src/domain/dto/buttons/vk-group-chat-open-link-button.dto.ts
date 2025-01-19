import { VkGroupChatButtonTypeEnum } from '../../enums/chat-button-type.enum';
import { SerializedName } from '../../decorators/serialized-name.decorator';
import { VkGroupChatButtonAbstractDto } from './vk-group-chat-abstract-button.dto';
import { VkGroupChatButtonColorEnum } from '../../enums/chat-button-color.enum';

class VkGroupChatOpenLinkButtonActionDto implements VkGroupChatButtonAbstractDto {
	@SerializedName('type')
	public type: VkGroupChatButtonTypeEnum = VkGroupChatButtonTypeEnum.OPEN_LINK;

	@SerializedName('link')
	public link: string = null;

	@SerializedName('label')
	public label: string = null;

	@SerializedName('payload')
	public payload?: object = null;

	constructor(link: string, label: string, payload?: object) {
		this.link = link;
		this.label = label;
		this.payload = payload;
	}
}

export class VkGroupChatOpenLinkButtonDto {
	@SerializedName('action')
	public action: VkGroupChatOpenLinkButtonActionDto = null;

	constructor(link: string, label: string, payload?: object) {
		this.action = new VkGroupChatOpenLinkButtonActionDto(link, label, payload);
	}
}