import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VkBotModule } from './infrastructure/modules/vk/vk-bot.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigService } from './infrastructure/db/orm/orm-config.service';

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
		VkBotModule,
	],
})
export class AppModule {
}