import 'reflect-metadata';
import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { VkBotApiService } from './vk-bot-api.service';
import axios from 'axios';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { EVENT_LISTENER } from './vk-bot-event.decorator';

type VkBotEventCallback = (...args: any[]) => void;

@Injectable()
export class VkBotLongPollingService implements OnModuleInit, OnApplicationShutdown {
	private readonly logger = new Logger(VkBotLongPollingService.name);
	private longPollingKey: string;
	private longPollingTs: string;
	private eventListeners: Map<string, VkBotEventCallback[]> = new Map();

	constructor(private readonly discoveryService: DiscoveryService,
				private readonly reflector: Reflector,
				private readonly metadataScanner: MetadataScanner,
				private readonly vkBotApiService: VkBotApiService) {
	}

	async onModuleInit() {
		this.initializeEventListeners();

		const longPollServer = await this.initialLongPollServer();
		this.listenForEvents(longPollServer).then(null);
	}

	public subscribe(event: string, callback: VkBotEventCallback) {
		if (!this.eventListeners.has(event)) {
			this.eventListeners.set(event, []);
		}
		this.eventListeners.get(event)?.push(callback);
	}

	private initializeEventListeners() {
		const allProviders = this.discoveryService.getProviders();

		allProviders.forEach(({ instance }) => {
			if (instance) {
				const methodNames = this.metadataScanner.getAllMethodNames(instance);
				for (const methodName of methodNames) {
					const event = this.reflector.get(EVENT_LISTENER, instance[methodName]);

					if (event) {
						const callback = instance[methodName];

						this.logger.log(`Subscribing vk bot event listener: ${event}, ${methodName}`);
						this.subscribe(event, callback);
					}
				}
			}
		});
	}

	private async initialLongPollServer(): Promise<string> {
		const longPollServer = await this.vkBotApiService.getLongPollServer();
		this.longPollingKey = longPollServer.key;
		this.longPollingTs = longPollServer.ts;

		return longPollServer.server;
	}

	private async listenForEvents(longPollServerUrl: string): Promise<void> {
		this.logger.log('VK Long Polling started...');

		while (true) {
			try {
				const response = await axios.get(longPollServerUrl, {
					params: {
						act: 'a_check',
						key: this.longPollingKey,
						ts: this.longPollingTs,
						wait: 25,
					},
				});

				for (const event of response.data?.updates) {
					const callbacks = this.eventListeners.get(event.type) ?? [];
					for (const callback of callbacks) {
						callback(event.object);
					}
				}

				this.longPollingTs = response.data.ts;
			} catch (error) {
				console.error('Error in VK Long Polling:', error.message);
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}
		}
	}

	onApplicationShutdown() {
		this.eventListeners.clear();
	}
}