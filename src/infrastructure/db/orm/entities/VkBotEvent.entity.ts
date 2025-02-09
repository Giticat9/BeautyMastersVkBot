import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { VkGroupEvents } from '../../../modules/vk/vk-bot-events.enum';

@Entity()
export class VkBotEvent {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column('varchar', { length: 255, nullable: false })
	eventId: string;

	@Column('enum', { enum: VkGroupEvents, nullable: false })
	eventType: VkGroupEvents;

	@Column('varchar', { length: 10, nullable: false })
	eventApiVersion: string;

	@Column('integer', { nullable: false })
	messageId: number;

	@Column('integer', { nullable: false })
	messageDate: number;

	@Column('integer', { nullable: false })
	messageFromId: number;

	@Column('integer', { nullable: false })
	messagePeerId: number;

	@Column('varchar', { length: 1000, nullable: true })
	messagePayload: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}