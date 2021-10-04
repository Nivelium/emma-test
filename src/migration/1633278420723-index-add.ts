import {MigrationInterface, QueryRunner} from "typeorm";

export class indexAdd1633278420723 implements MigrationInterface {
    name = 'indexAdd1633278420723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_4d77945f174140c04697736216" ON "public"."Transactions" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0ad725dbc24f65325a7cb54f93" ON "public"."Transactions" ("merchant_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_0ad725dbc24f65325a7cb54f93"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d77945f174140c04697736216"`);
    }
}
