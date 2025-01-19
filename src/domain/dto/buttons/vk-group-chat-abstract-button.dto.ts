import { VkGroupChatButtonTypeEnum } from '../../enums/chat-button-type.enum';

export abstract class VkGroupChatButtonAbstractDto {
	public abstract readonly type: VkGroupChatButtonTypeEnum;
}