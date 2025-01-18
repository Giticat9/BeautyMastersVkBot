import { Module } from '@nestjs/common';
import { VkBotApiService } from './vk-bot-api.service';
import { VkBotLongPollingService } from './vk-bot-long-polling.service';
import {
	VkGroupNewMessageHandlerService,
} from '../../../application/services/vk/handlers/vk-group-new-message-handler.service';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';

@Module({
	providers: [
		DiscoveryService,
		MetadataScanner,

		VkBotApiService,
		VkBotLongPollingService,
		VkGroupNewMessageHandlerService,
	],
})
export class VkBotModule {
}