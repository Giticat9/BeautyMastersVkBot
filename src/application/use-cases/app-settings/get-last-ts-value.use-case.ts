import { Inject, Injectable } from '@nestjs/common';
import { IAppSettingsRepository } from '../../../domain/repositories/app-settings.repository';

@Injectable()
export class GetLastTsValueUseCase {
	constructor(
		@Inject('IAppSettingsRepository')
		private readonly appSettingsRepository: IAppSettingsRepository,
	) {}

	async execute(): Promise<string> {
		return await this.appSettingsRepository.getLastTSValueAsync();
	}
}
