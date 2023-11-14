import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedTourData1699925379060 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO tour (name, sellerId, reservationLimit) VALUES ('크루즈 투어', 1, 5)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM tour WHERE name = '크루즈 투어' AND sellerId = 1`);
    }
}
