import { VkGroupChatButtonTypeEnum } from '../../enums/chat-button-type.enum';
import { SerializedName } from '../../decorators/serialized-name.decorator';
import { VkGroupChatButtonAbstractDto } from './vk-group-chat-abstract-button.dto';

class VkGroupChatOpenAppButtonActionDto implements VkGroupChatButtonAbstractDto {
	@SerializedName('type')
	public type: VkGroupChatButtonTypeEnum = VkGroupChatButtonTypeEnum.OPEN_APP;

	@SerializedName('app_id')
	public appId: string = null;

	@SerializedName('label')
	public label: string = null;

	@SerializedName('owner_id')
	public ownerId?: string = null;

	@SerializedName('hash')
	public hash?: string = null;

	@SerializedName('payload')
	public payload?: object = null;

	constructor(appId: string, label: string, ownerId?: string, hash?: string, payload?: object) {
		this.appId = appId;
		this.label = label;
		this.ownerId = ownerId;
		this.hash = hash;
		this.payload = payload;
	}
}

export class VkGroupChatOpenAppButtonDto {
	@SerializedName('action')
	public action: VkGroupChatOpenAppButtonActionDto = null;

	constructor(appId: string, label: string, ownerId?: string, hash?: string, payload?: object) {
		this.action = new VkGroupChatOpenAppButtonActionDto(appId, label, ownerId, hash, payload);
	}
}