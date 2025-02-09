import { IAppSettingsRepository } from '../../../domain/repositories/app-settings.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SetLastTsValueUseCase {
	constructor(
		@Inject('IAppSettingsRepository')
		private readonly appSettingsRepository: IAppSettingsRepository,
	) {}

	async execute(value: string): Promise<void> {
		return await this.appSettingsRepository.setLastTSValueAsync(value);
	}
}
