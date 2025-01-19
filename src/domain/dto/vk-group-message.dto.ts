import { SerializedName } from '../decorators/serialized-name.decorator';
import {
	VkGroupChatCallbackButtonDto,
	VkGroupChatLocationButtonDto,
	VkGroupChatOpenAppButtonDto,
	VkGroupChatOpenLinkButtonDto,
	VkGroupChatTextButtonDto,
	VkGroupChatVkpayButtonDto,
} from './buttons';

type VkGroupMessageButtonType =
	| VkGroupChatTextButtonDto
	| VkGroupChatLocationButtonDto
	| VkGroupChatOpenLinkButtonDto
	| VkGroupChatOpenAppButtonDto
	| VkGroupChatVkpayButtonDto
	| VkGroupChatCallbackButtonDto

export class VkGroupMessageDto {
	@SerializedName('one_time')
	public oneTime: boolean = false;

	@SerializedName('inline')
	public inline?: boolean = false;

	@SerializedName('buttons')
	public buttons: VkGroupMessageButtonType[][] = [];

	constructor(oneTime: boolean = false, inline: boolean = false, buttons: VkGroupMessageButtonType[][] = []) {
		this.oneTime = oneTime;
		this.inline = inline;
		this.buttons = buttons;
	}
}