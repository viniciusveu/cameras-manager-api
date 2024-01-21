import { Module } from '@nestjs/common';
import { CamerasController } from './cameras.controller';
import { Camera } from './cameras.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from '../customers/customers.module';
import { AlertsModule } from '../alerts/alerts.module';
import { CamerasService } from './cameras.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Camera]),
        CustomersModule,
        AlertsModule,
    ],
    controllers: [CamerasController],
    providers: [CamerasService]
})
export class CamerasModule { }
