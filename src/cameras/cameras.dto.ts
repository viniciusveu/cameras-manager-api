import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsIP,
  IsUUID,
  IsOptional,
  IsDateString
} from 'class-validator';

export class CreateCameraDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Camera 1',
    description: 'Nome da câmera',
    required: true
  })
  name: string;

  @IsString()
  @IsIP()
  @IsNotEmpty()
  @ApiProperty({
    example: '191.13.7.5',
    description: 'IP da câmera',
    required: true
  })
  ip: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  @ApiProperty({
    example: '277b7a78-9cce-476f-ac11-223906d28aed',
    description: 'ID do cliente da câmera',
    required: true
  })
  customer_id: string;
}

export class AlertFilterDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'ID do cliente para consultar',
    required: false
  })
  customer_id?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Data inicial para a consulta',
    example: '2023-10-13T14:50:03',
    required: false
  })
  start_at?: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Data final para a consulta',
    example: '2023-10-13T15:30:05',
    required: false
  })
  end_at?: Date;
}
