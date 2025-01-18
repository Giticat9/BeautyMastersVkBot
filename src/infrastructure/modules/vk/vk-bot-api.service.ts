import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetLongPollServerResponse } from '../../interfaces/vk/get-long-poll-server-response.interface';
import axios from 'axios';

@Injectable()
export class VkBotApiService {
	private readonly vkApiUrl: string = null;
	private readonly vkApiVersion: string = null;
	private readonly vkGroupId: string = null;
	private readonly vkGroupAccessToken: string = null;

	constructor(readonly configService: ConfigService) {
		this.vkApiUrl = configService.get<string>('VK_API_URL');
		this.vkApiVersion = configService.get<string>('VK_API_VERSION');
		this.vkGroupId = configService.get<string>('VK_GROUP_ID');
		this.vkGroupAccessToken = configService.get<string>('VK_GROUP_ACCESS_TOKEN');
	}

	async getLongPollServer(): Promise<GetLongPollServerResponse> {
		const url = new URL('groups.getLongPollServer', this.vkApiUrl).toString();
		const response = await axios.get<GetLongPollServerResponse>(url, {
			params: {
				group_id: this.vkGroupId,
				access_token: this.vkGroupAccessToken,
				v: this.vkApiVersion,
			},
			transformResponse: (data) => JSON.parse(data)?.response
		});

		return response.data;
	}
}