import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DefaultNamingStrategy } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

export class SnakeCaseNamingStrategy extends DefaultNamingStrategy {
	columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
		const name = customName ?? propertyName;
		if (embeddedPrefixes.length) {
			return snakeCase(embeddedPrefixes.join('_')) + '__' + snakeCase(name);
		}
		return snakeCase(name);
	}
}

const typeormCommonOptions: Partial<TypeOrmModuleOptions> = {
	entities: ['dist/infrastructure/db/orm/entities/**/*.entity.js'],
	migrations: ['dist/infrastructure/db/orm/migrations/**/*.migration.js'],
	migrationsTransactionMode: 'all',
	logging: true,
	manualInitialization: true,
	synchronize: false,
	migrationsRun: false,
	namingStrategy: new SnakeCaseNamingStrategy(),
};

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
	constructor(private readonly configService: ConfigService) {
	}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		const dbType = this.configService.get<string>('DB_KIND') ?? 'postgres';
		const options = Object.assign({ type: dbType }, typeormCommonOptions);

		if (dbType === 'postgres') {
			const dbHost = this.configService.get<string>('DB_HOST');
			const dbPort = this.configService.get<string>('DB_PORT');
			const dbName = this.configService.get<string>('DB_NAME');
			const dbUsername = this.configService.get<string>('DB_USERNAME');
			const dbPassword = this.configService.get<string>('DB_PASSWORD');

			return Object.assign(options, {
				host: dbHost,
				port: dbPort,
				database: dbName,
				username: dbUsername,
				password: dbPassword,
			});
		} else {
			throw new Error(`Unknown database type ${dbType}`);
		}
	}
}