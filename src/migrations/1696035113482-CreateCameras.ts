import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateCameras1696035113482 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'camera',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'ip',
                        type: 'varchar',
                    },
                    {
                        name: 'is_enabled',
                        type: 'boolean',
                        default: true
                    },
                    {
                        name: 'customer_id',
                        type: 'varchar',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'customer_id_fk',
                        columnNames: ['customer_id'],
                        referencedTableName: 'customer',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    }
                ]
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('camera');
    }

}
