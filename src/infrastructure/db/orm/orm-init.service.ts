import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeormInitService implements OnModuleInit {
	private readonly logger = new Logger(TypeormInitService.name);

	constructor(private readonly dataSource: DataSource) {}

	async onModuleInit() {
		await this.initializeDatabase();
	}

	private async initializeDatabase(retryCount: number = 1, maxRetryCount: number = 5) {
		try {
			this.logger.log('Running database initialization...');
			await this.dataSource.initialize();

			if (this.dataSource.isInitialized) {
				this.logger.log('Database initialized successfully.');
			}
		} catch (error) {
			this.logger.error(`Database initialized failed: ${error}`);
			if (retryCount <= maxRetryCount) {
				this.logger.warn('Retrying initialization long poll server');
				await this.initializeDatabase(retryCount + 1, maxRetryCount);
			}
		}
	}
}
