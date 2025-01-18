import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VkBotModule } from './infrastructure/modules/vk/vk-bot.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
		}),
		VkBotModule,
	],
})
export class AppModule {
}