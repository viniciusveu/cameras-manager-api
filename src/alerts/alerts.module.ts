import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './alerts.entity';
import { AlertsService } from './alerts.service';

@Module({
    imports: [TypeOrmModule.forFeature([Alert])],
    exports: [AlertsService],
    providers: [AlertsService],
})
export class AlertsModule {}
