import { DataSource } from 'typeorm';
import { SnakeCaseNamingStrategy } from './orm-config.service';
import * as dotenv from 'dotenv';

dotenv.config();

export const ApplicationDataSource = new DataSource({
	type: process.env.DB_KIND as any,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: ['dist/infrastructure/db/orm/entities/**/*.entity.js'],
	migrations: ['dist/infrastructure/db/migrations/**/*.js'],
	migrationsTransactionMode: 'all',
	logging: true,
	synchronize: false,
	namingStrategy: new SnakeCaseNamingStrategy(),
});