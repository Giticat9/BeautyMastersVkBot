import { IAppSettingsRepository } from '../../../domain/repositories/app-settings.repository';
import { TransactionService } from '../orm/transaction-context.service';
import { AppSettings } from '../orm/entities/AppSettings.entity';
import { AppSettingsKeysEnum } from '../../../domain/enums/app-settings-keys.enum';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppSettingsRepositoryImpl implements IAppSettingsRepository {
	private readonly logger = new Logger(AppSettingsRepositoryImpl.name);

	constructor(private readonly transactionService: TransactionService) {}

	async getLastTSValueAsync(): Promise<string> {
		return await this.transactionService.execute(async queryRunner => {
			const row = await queryRunner.manager.findOne(AppSettings, {
				select: ['value'],
				where: {
					key: AppSettingsKeysEnum.LAST_TS_VALUE,
				},
			});

			if (!row?.value) {
				this.logger.warn('last TS value is undefined, returning default value (0)');
			}

			return row?.value ?? '0';
		});
	}

	async setLastTSValueAsync(value: string): Promise<void> {
		return await this.transactionService.executeInTransaction(async queryRunner => {
			const row = await queryRunner.manager.findOne(AppSettings, {
				select: ['value'],
				where: {
					key: AppSettingsKeysEnum.LAST_TS_VALUE,
				},
			});

			const currentValue = Number(row?.value ?? '0');
			const settlesValue = Number(value ?? '0');

			if (settlesValue <= currentValue) {
				this.logger.warn(
					`value is less than or equal to current last ts value, update is not possible. ${settlesValue} <= ${currentValue}`,
				);
				return;
			}

			await queryRunner.manager.update(
				AppSettings,
				{ key: AppSettingsKeysEnum.LAST_TS_VALUE },
				{
					value,
				},
			);

			this.logger.log(`last ts value is updated successfully. Current value: ${value}.`);
		});
	}
}
