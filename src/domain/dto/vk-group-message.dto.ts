import { SerializedName } from '../decorators/serialized-name.decorator';

export class VkGroupMessageButtonActionPayloadDto {
	@SerializedName('command')
	public command: string;

	constructor(command: string) {
		this.command = command;
	}
}

export class VkGroupMessageButtonActionDto {
	@SerializedName('type')
	public type: string;
	@SerializedName('label')
	public label?: string;
	@SerializedName('payload')
	public payload?: VkGroupMessageButtonActionPayloadDto;

	constructor(type: string,
				label: string = null,
				payload: VkGroupMessageButtonActionPayloadDto = null) {
		this.type = type;
		this.label = label;
		this.payload = payload;
	}
}

export class VkGroupMessageButtonDto {
	@SerializedName('action')
	public action: VkGroupMessageButtonActionDto;

	constructor(action: VkGroupMessageButtonActionDto) {
		this.action = action;
	}
}

export class VkGroupMessageDto {
	@SerializedName('one_time')
	public oneTime: boolean = false;
	@SerializedName('buttons')
	public buttons: VkGroupMessageButtonDto[][] = [];

	constructor(oneTime: boolean = false, buttons: VkGroupMessageButtonDto[][] = []) {
		this.oneTime = oneTime;
		this.buttons = buttons;
	}
}