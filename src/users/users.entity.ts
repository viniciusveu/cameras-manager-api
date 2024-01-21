import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as crypto from 'crypto';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password?: string;

  constructor(name?: string, password?: string, id?: string) {
    this.id = id || crypto.randomUUID();
    password ? (this.password = password) : null;
    this.name = name || 'test';
  }
}
