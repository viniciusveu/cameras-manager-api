import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { isIP } from 'net';
import { Customer } from '../customers/customers.entity';
import { Alert } from '../alerts/alerts.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('camera')
export class Camera {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ 
    example: '277b7a78-9cce-476f-ac11-223906d28aed', 
    description: 'ID da câmera' ,
  })
  id?: string;

  @Column()
  @ApiProperty({ 
    example: 'Camera 1', 
    description: 'Nome da câmera', 
    required: true 
  })
  name: string;

  @Column()
  @ApiProperty({ 
    example: '191.13.7.5', 
    description: 'IP da câmera', 
    required: true 
  })
  ip: string;

  @Column({ default: true })
  @ApiProperty({  
    description: 'Status de ativação da câmera', 
    default: true, 
    required: false 
  })
  is_enabled: boolean;

  @Column()
  @ApiProperty({ 
    example: '277b7a78-9cce-476f-ac11-223906d28aed', 
    description: 'ID do cliente da câmera' ,
    required: true
  })
  customer_id: string;

  @ManyToOne(() => Customer, customer => customer.cameras)
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @OneToMany(() => Alert, alert => alert.camera)
  @JoinColumn({ name: 'id' })
  alerts?: Alert[];

  constructor(
    name: string,
    ip: string,
    customer_id: string,
    id?: string,
    is_enabled?: boolean
  ) {
    this.name = name;
    this.ip = ip;
    this.customer_id = customer_id;
    id ? (this.id = id) : null;
    this.is_enabled = is_enabled || true;
  }

  switch(): void {
    this.is_enabled = !this.is_enabled;
  }

  isValidIp(): boolean {
    return isIP(this.ip) === 4;
  }
}
