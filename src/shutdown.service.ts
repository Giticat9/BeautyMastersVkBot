import { Injectable, Logger, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class ShutdownService implements OnModuleDestroy, OnApplicationShutdown {
	private readonly logger: Logger = new Logger(ShutdownService.name);

	onModuleDestroy() {
		this.logger.log('Module is being destroyed. Closing application.');
	}

	onApplicationShutdown(signal?: string) {
		this.logger.log(`Application is shutting down due to signal: ${signal}`);
		process.exit(0);
	}

	shutdown() {
		this.logger.warn('Application shutdown initiated');
		process.kill(process.pid, 'SIGTERM');
	}
}
