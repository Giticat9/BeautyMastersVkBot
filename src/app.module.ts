import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigService } from './infrastructure/db/orm/orm-config.service';
import { TransactionService } from './infrastructure/db/orm/transaction-context.service';
import { AppSettingsRepositoryImpl } from './infrastructure/db/repositories/app-settings.repository.impl';
import { VkBotEventRepositoryImpl } from './infrastructure/db/repositories/vk-bot-event.repository.impl';
import { GetLastTsValueUseCase } from './application/use-cases/app-settings/get-last-ts-value.use-case';
import { SetLastTsValueUseCase } from './application/use-cases/app-settings/set-last-ts-value.use-case';
import { AddVkBotEventUseCase } from './application/use-cases/vk-bot-event/add-vk-bot-event.use-case';
import { CheckExistsVkBotEventUseCase } from './application/use-cases/vk-bot-event/check-exists-vk-bot-event.use-case';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { RateLimiterService } from './application/services/rate-limiter.service';
import { VkBotApiService } from './infrastructure/modules/vk/vk-bot-api.service';
import { VkBotLongPollingService } from './infrastructure/modules/vk/vk-bot-long-polling.service';
import { VkGroupNewMessageHandlerService } from './application/services/vk/handlers/vk-group-new-message-handler.service';
import { EventProcessingService } from './domain/services/event-processing.service';
import { EventNewMessagePayloadService } from './domain/services/payloads/event-new-message-payload.service';
import { ShutdownService } from './shutdown.service';
import { TypeormInitService } from './infrastructure/db/orm/orm-init.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useClass: TypeormConfigService,
		}),
	],
	providers: [
		TypeormInitService,
		ShutdownService,
		DiscoveryService,
		MetadataScanner,

		RateLimiterService,

		VkBotApiService,
		VkBotLongPollingService,
		VkGroupNewMessageHandlerService,

		EventProcessingService,
		EventNewMessagePayloadService,

		TransactionService,

		GetLastTsValueUseCase,
		SetLastTsValueUseCase,
		AddVkBotEventUseCase,
		CheckExistsVkBotEventUseCase,
		{
			provide: 'IAppSettingsRepository',
			useClass: AppSettingsRepositoryImpl,
		},
		{
			provide: 'IVkBotEventRepository',
			useClass: VkBotEventRepositoryImpl,
		},
	],
})
export class AppModule {}
