import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionService {
	constructor(private readonly dataSource: DataSource) {
	}

	async execute<T>(work: (queryRunner: QueryRunner, txn?: TransactionService) => Promise<T>,
					 existingQueryRunner?: QueryRunner): Promise<T> {
		if (existingQueryRunner) {
			return await work(existingQueryRunner, this);
		}

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();

		try {
			return await work(queryRunner, this);
		} finally {
			await queryRunner.release();
		}
	}

	async executeInTransaction<T>(work: (queryRunner: QueryRunner, txn?: TransactionService) => Promise<T>,
								  existingQueryRunner?: QueryRunner): Promise<T> {
		if (existingQueryRunner && existingQueryRunner.isTransactionActive) {
			return await work(existingQueryRunner, this);
		}

		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const result = await work(queryRunner, this);
			await queryRunner.commitTransaction();

			return result;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new Error(error);
		} finally {
			await queryRunner.release();
		}
	}
}