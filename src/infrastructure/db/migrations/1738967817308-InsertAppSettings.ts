import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertAppSettings1738967817308 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO app_settings (key, value) VALUES ('LAST_TS_VALUE', '0')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM app_settings WHERE key = 'LAST_TS_VALUE'`);
    }

}
