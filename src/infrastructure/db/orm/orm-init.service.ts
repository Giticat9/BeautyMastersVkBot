import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ShutdownService } from '../../../shutdown.service';

const transactionIsolationProperty = 'default_transaction_isolation';

@Injectable()
export class TypeormInitService implements OnModuleInit {
	private readonly logger = new Logger(TypeormInitService.name);
	private readonly devMode: boolean = false;
	private readonly runMigrationsAndShutdown: boolean = false;

	constructor(private readonly configService: ConfigService,
				private readonly dataSource: DataSource,
				private readonly shutdownService: ShutdownService) {
		this.devMode = this.configService.get<boolean>('DB_DEV_MODE') ?? false;
		this.runMigrationsAndShutdown = this.configService.get<boolean>('DB_MIGRATE') ?? false;
	}

	async onModuleInit() {
		await this.dataSource.initialize();
		const alreadySerializableTransactions = await this.ensureTransactionIsolation();

		if (this.devMode) {
			this.logger.log('Running db synchronization');
			await this.dataSource.synchronize();
		}

		if (this.runMigrationsAndShutdown) {
			this.logger.log('Running db migrations');
			await this.dataSource.runMigrations();
		}

		if (this.runMigrationsAndShutdown || !alreadySerializableTransactions) {
			this.logger.log('Shutting down app after db migrations');
			this.shutdownService.shutdown();
			return;
		}

		const logs = await this.dataSource.driver.createSchemaBuilder().log();
		if (logs.upQueries.length) {
			this.logger.warn('Database state require sync');
			this.shutdownService.shutdown();
		}
	}

	private async ensureTransactionIsolation(): Promise<boolean> {
		const isolationLevelResp =
			(await this.dataSource.query(`SHOW ${transactionIsolationProperty}`)) || [];
		const isolationLevel =
			(isolationLevelResp[0] || {})[transactionIsolationProperty] || 'unknown';
		if (isolationLevel.toLowerCase() != 'serializable') {
			this.logger.log(
				`Incorrect default database transaction isolation level '${isolationLevel.toLowerCase()}', expected 'serializable'`,
			);
			if (this.runMigrationsAndShutdown || this.devMode) {
				this.logger.log(
					`Executing ALTER DATABASE ${this.dataSource.options.database} SET ${transactionIsolationProperty} TO SERIALIZABLE;`,
				);
				await this.dataSource.query(
					`ALTER DATABASE ${this.dataSource.options.database} SET ${transactionIsolationProperty} TO SERIALIZABLE;`,
				);
			} else {
				this.logger.log(
					`Either run migration or run 'ALTER DATABASE ${this.dataSource.options.database} SET ${transactionIsolationProperty} TO SERIALIZABLE;' manually`,
				);
			}
			return false;
		}
		return true;
	}
}