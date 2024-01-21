import { Injectable } from '@nestjs/common'; import { Alert } from './alerts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class AlertsService {
    constructor(
        @InjectRepository(Alert)
        private readonly alertRepository: Repository<Alert>,
    ) { }

    public async create(alert: Alert): Promise<Alert> {
        return await this.alertRepository.save(alert);
    }

    public async findByCamera(camera_id: string): Promise<Alert[]> {
        return await this.alertRepository.find({
            where: { camera_id: camera_id }
        });
    }

    // public async findByCustomer(customer_id: string): Promise<Alert[]> {

    // }

    public async getTodayAlerts(): Promise<Alert[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

        return await this.alertRepository.find({
            where: {
                occurred_at: MoreThanOrEqual(today) && LessThanOrEqual(tomorrow)
            }
        });
    }
}
