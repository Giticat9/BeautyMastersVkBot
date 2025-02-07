import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ShutdownService } from './shutdown.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableShutdownHooks();
	app.get(ShutdownService).subscribeToShutdown(() => app.close());

	await app.listen(3000);
}

bootstrap();
