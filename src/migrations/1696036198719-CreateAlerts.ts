import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateAlerts1696036198719 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'alert',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                    },
                    {
                        name: 'occurred_at',
                        type: 'datetime',
                    },
                    {
                        name: 'camera_id',
                        type: 'varchar',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'camera_id_fk',
                        columnNames: ['camera_id'],
                        referencedTableName: 'camera',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    }
                ]
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('alert');
    }

}
