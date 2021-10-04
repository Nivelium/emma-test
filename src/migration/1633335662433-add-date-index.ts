import {MigrationInterface, QueryRunner} from "typeorm";

export class addDateIndex1633335662433 implements MigrationInterface {
    name = 'addDateIndex1633335662433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Transactions" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "amount" integer NOT NULL, "description" character varying NOT NULL, "user_id" integer, "merchant_id" integer, CONSTRAINT "PK_7761bf9766670b894ff2fdb3700" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_82e3bdc16cbbf77af0e5ace3f6" ON "Transactions" ("date") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d77945f174140c04697736216" ON "Transactions" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0ad725dbc24f65325a7cb54f93" ON "Transactions" ("merchant_id") `);
        await queryRunner.query(`CREATE TABLE "Merchants" ("id" SERIAL NOT NULL, "display_name" character varying NOT NULL, "icon_url" character varying NOT NULL, "funny_gif_url" character varying NOT NULL, CONSTRAINT "PK_02c74e694ba84f0ea07911bc329" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD CONSTRAINT "FK_4d77945f174140c046977362160" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD CONSTRAINT "FK_0ad725dbc24f65325a7cb54f939" FOREIGN KEY ("merchant_id") REFERENCES "Merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transactions" DROP CONSTRAINT "FK_0ad725dbc24f65325a7cb54f939"`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP CONSTRAINT "FK_4d77945f174140c046977362160"`);
        await queryRunner.query(`DROP TABLE "Merchants"`);
        await queryRunner.query(`DROP INDEX "IDX_0ad725dbc24f65325a7cb54f93"`);
        await queryRunner.query(`DROP INDEX "IDX_4d77945f174140c04697736216"`);
        await queryRunner.query(`DROP INDEX "IDX_82e3bdc16cbbf77af0e5ace3f6"`);
        await queryRunner.query(`DROP TABLE "Transactions"`);
        await queryRunner.query(`DROP TABLE "Users"`);
    }

}
