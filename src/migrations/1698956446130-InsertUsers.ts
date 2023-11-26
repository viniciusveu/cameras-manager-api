import { MigrationInterface, QueryRunner } from "typeorm"
import { v4 as uuidv4 } from 'uuid';

export class InsertUsers1698956446130 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const users = [];
        const defaultUser = { id: '67860b7f-c151-4f87-9ec6-e3216516e3bf', name: 'User0', password: 'Password0!'} 
        users.push(defaultUser);

        for (let i = 1; i < 30; i++) {
            const user = { id: uuidv4(), name: `User${i}`, password: `Password${i}` };
            users.push(user);
        }

        for (const user of users) {
            await queryRunner.query('INSERT INTO user (id, name, password) VALUES (?, ?, ?)', [user.id, user.name, user.password]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (let i = 0; i < 30; i++) {
            const name = `User${i}`;
            await queryRunner.query('DELETE FROM user WHERE name = ?', [name]);
        }
    }

}
