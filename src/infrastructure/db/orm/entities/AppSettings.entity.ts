import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AppSettingsKeysEnum } from '../../../../domain/enums/app-settings-keys.enum';

@Entity()
export class AppSettings {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column('enum', { enum: AppSettingsKeysEnum, nullable: false })
	key: AppSettingsKeysEnum;

	@Column('varchar', { length: 255, nullable: false })
	value: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}