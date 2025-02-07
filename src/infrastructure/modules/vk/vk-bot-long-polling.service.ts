import 'reflect-metadata';
import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { VkBotApiService } from './vk-bot-api.service';
import axios from 'axios';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { EVENT_LISTENER } from './vk-bot-event.decorator';
import { GetLongPollEventResponse } from '../../interfaces/vk/get-long-poll-event-response.interface';
import { LongPollingFailedEnum } from './vk-bot-long-polling-failed.enum';

type VkBotEventCallback = (...args: any[]) => Promise<void>;

@Injectable()
export class VkBotLongPollingService implements OnModuleInit, OnApplicationShutdown {
	private readonly logger = new Logger(VkBotLongPollingService.name);
	private isRunning: boolean = false;
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

	onApplicationShutdown() {
		this.isRunning = false;
		this.eventListeners.clear();
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
			if (instance && typeof instance === 'object') {
				const methodNames = this.metadataScanner?.getAllMethodNames(instance);
				for (const methodName of methodNames) {
					const event = this.reflector.get(EVENT_LISTENER, instance[methodName]);

					if (event) {
						const callback = instance[methodName];

						this.logger.log(`Subscribing vk bot event listener. { event_name: ${event}, callback: ${methodName} }`);
						this.subscribe(event, callback.bind(instance));
					}
				}
			}
		});
	}

	private async initialLongPollServer(retryCount = 0, maxRetryCount = 5): Promise<string> {
		try {
			const longPollServer = await this.vkBotApiService.getLongPollServer();
			this.logger.log('Initialization long poll server is successfully');

			this.longPollingKey = longPollServer.key;
			this.longPollingTs = longPollServer.ts;

			return longPollServer.server;
		} catch (error) {
			this.logger.error(`Initialization long poll server is failed: ${error.message}`);
			if (retryCount <= maxRetryCount) {
				this.logger.warn('Retrying initialization long poll server');
				await this.initialLongPollServer(retryCount + 1, maxRetryCount);
			}
		}
	}

	private async listenForEvents(longPollServerUrl: string): Promise<void> {
		this.logger.log('VK Long Polling started');

		while (this.isRunning) {
			try {
				const response = await axios.get<GetLongPollEventResponse>(longPollServerUrl, {
					params: {
						act: 'a_check',
						key: this.longPollingKey,
						ts: this.longPollingTs,
						wait: 25,
					},
				});

				if ('failed' in response?.data) {
					await this.longPollServerErrorHandling(response?.data);
				} else {
					for (const event of response.data?.updates ?? []) {
						const callbacks = this.eventListeners.get(event.type) ?? [];
						for (const callback of callbacks) {
							await callback(event);
						}
					}

					this.longPollingTs = response.data.ts;
				}
			} catch (error) {
				console.error('Error in VK Long Polling:', error.message);
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}
		}
	}

	private async longPollServerErrorHandling(longPollingData: GetLongPollEventResponse) {
		const { failed, ts } = longPollingData;
		let message = 'Error received from long poll server.';

		if (failed === LongPollingFailedEnum.HISTORY_EVENTS_OUTDATED_OR_LOST) {
			message += ` History events outdated or lost. Write new TS value: ${ts}`;
			this.logger.warn(message);
			this.longPollingTs = ts;
		} else if (failed === LongPollingFailedEnum.KEY_IS_EXPANDED) {
			message += ` Key is exceeded. Reinitialization long poll server`;
			this.logger.warn(message);

			await this.initialLongPollServer();
		} else if (failed === LongPollingFailedEnum.INFORMATION_LOST) {
			message += ` Information lost. Reinitialization long poll server`;
			this.logger.warn(message);

			await this.initialLongPollServer();
		}
	}
}