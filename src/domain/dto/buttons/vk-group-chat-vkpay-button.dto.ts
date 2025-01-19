import { VkGroupChatButtonAbstractDto } from './vk-group-chat-abstract-button.dto';
import { SerializedName } from '../../decorators/serialized-name.decorator';
import { VkGroupChatButtonTypeEnum } from '../../enums/chat-button-type.enum';

class VkGroupChatVkpayButtonActionDto implements VkGroupChatButtonAbstractDto {
	@SerializedName('type')
	public type: VkGroupChatButtonTypeEnum = VkGroupChatButtonTypeEnum.VK_PAY;

	@SerializedName('hash')
	public hash: string = null;

	@SerializedName('payload')
	public payload?: object = null;

	constructor(hash: string, payload?: object) {
		this.hash = hash;
		this.payload = payload;
	}
}

export class VkGroupChatVkpayButtonDto {
	@SerializedName('action')
	public action: VkGroupChatVkpayButtonActionDto = null;

	constructor(hash: string, payload: object) {
		this.action = new VkGroupChatVkpayButtonActionDto(hash, payload);
	}
}