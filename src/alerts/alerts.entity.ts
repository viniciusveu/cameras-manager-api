import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Camera } from '../cameras/cameras.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('alert')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'datetime' })
  @ApiProperty({  
    description: 'Hora da ocorrência', 
    default: 'Data/hora atual', 
    required: false 
  })
  occurred_at: Date;

  @Column()
  @ApiProperty({  
    example: '277b7a78-9cce-476f-ac11-223906d28aed',
    description: 'ID da câmera da ocorrência', 
    required: true 
  })
  camera_id: string;

  @ManyToOne(() => Camera, camera => camera.alerts)
  @JoinColumn({ name: 'camera_id' })
  camera?: Camera;

  constructor(camera_id: string) {
    this.occurred_at = new Date();
    this.camera_id = camera_id;
  }
}
