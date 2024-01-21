import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class InsertCustomers1698524653503 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const customers = [];
    for (let i = 0; i < 30; i++) {
      const id = uuidv4();
      const name = `Customer${i}`;
      const password = `Password${i}`;
      customers.push({ id, name, password });
    }

    for (const customer of customers) {
      await queryRunner.query('INSERT INTO customer (id, name, password) VALUES (?, ?, ?)', [customer.id, customer.name, customer.password]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (let i = 0; i < 30; i++) {
      const name = `Customer${i}`;
      await queryRunner.query('DELETE FROM customer WHERE name = ?', [name]);
    }
  }
}
  