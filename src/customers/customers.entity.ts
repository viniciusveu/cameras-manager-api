import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Camera } from '../cameras/cameras.entity';
import * as crypto from 'crypto';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password?: string;

  @OneToMany(() => Camera, camera => camera.customer)
  @JoinColumn({ name: 'id' })
  cameras?: Camera[];

  constructor(name?: string, password?: string, id?: string) {
    this.id = id || crypto.randomUUID();
    password ? (this.password = password) : null;
    this.name = name;
  }
}
