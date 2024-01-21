import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Camera } from './cameras.entity';
import { Repository } from 'typeorm';
import { Customer } from '../customers/customers.entity';
import { Alert } from '../alerts/alerts.entity';
import { AlertFilterDto } from './cameras.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersService } from '../customers/customers.service';
import { AlertsService } from '../alerts/alerts.service';

const INVALID_DATE = 'INVALID DATE';

@Injectable()
export class CamerasService {
  constructor(
    @InjectRepository(Camera)
    private readonly cameraRepository: Repository<Camera>,
    private readonly customerService: CustomersService,
    private readonly alertService: AlertsService,
  ) { }

  public async createACamera(camera: Camera): Promise<Camera> {
    const customer: Customer = await this.customerService.findById(camera.customer_id);
    if (!customer) throw new NotFoundException('Customer not found');

    const cameraWithSameIp = await this.findCameraByCustomerAndIp(
      camera.customer_id,
      camera.ip
    );
    if (cameraWithSameIp)
      throw new ConflictException(
        'Camera with same IP already exists for this customer'
      );

    return await this.cameraRepository.save(camera);
  }

  public async findCameraByCustomer(
    customer_id: string,
    status?: number
  ): Promise<Camera[]> {
    const customer: Customer = await this.customerService.findById(customer_id);
    if (!customer) throw new NotFoundException('Customer not found');

    const where = this.getWhereByStatus(status, customer_id);

    const cameras = await this.cameraRepository.find({
      where
    });

    return cameras;
  }

  public async switchCameraStatus(camera_id: string): Promise<Camera> {
    const camera: Camera = await this.findCamera(camera_id);
    if (!camera) {
      throw new NotFoundException('Camera not found');
    }

    camera.switch();
    await this.cameraRepository.update(camera_id, camera);

    return camera;
  }

  public async createAlert(camera_id: string): Promise<Alert> {
    const camera: Camera = await this.findCamera(camera_id);
    if (!camera) {
      throw new NotFoundException('Camera not found');
    }
    if (!camera.is_enabled) {
      throw new BadRequestException('Camera not enabled');
    }

    const alert = new Alert(camera_id);
    return await this.alertService.create(alert);
  }

  public async findAlerts(filterDto: AlertFilterDto): Promise<Alert[]> {
    const { customer_id, start_at, end_at } = filterDto;
    const startAt: Date | string = start_at ? new Date(start_at) : INVALID_DATE;
    const endAt: Date | string = end_at ? new Date(end_at) : INVALID_DATE;

    if (!customer_id) { 
      const todayAlerts = await this.alertService.getTodayAlerts();
      return todayAlerts;
    }

    let customerAlerts = await this.findCustomerAlerts(customer_id);
    customerAlerts = this.getInterval(customerAlerts, startAt, endAt);

    return customerAlerts;
  }

  private async findCustomerAlerts(customer_id: string): Promise<Alert[]> {
    const customer = await this.customerService.findById(customer_id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const cameras: Camera[] = await this.findCameraByCustomer(customer.id);

    const alertsByUser = [];
    for (const camera of cameras) {
      const alertsByCamera = await this.alertService.findByCamera(camera.id);
      alertsByUser.push(...alertsByCamera);
    }

    return alertsByUser;
  }

  private async findCamera(camera_id: string): Promise<Camera> {
    return await this.cameraRepository.findOne({
      where: { id: camera_id }
    });
  }

  private async findCameraByCustomerAndIp(
    customer_id: string,
    camera_ip: string
  ): Promise<Camera> {
    return await this.cameraRepository.findOne({
      where: {
        customer_id,
        ip: camera_ip
      }
    });
  }

  private getInterval(
    alerts: Alert[],
    startAt: Date | string,
    endAt: Date | string
  ): Alert[] {
    if (!this.isValidDate(startAt)) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      return alerts.filter(alert => alert.occurred_at >= today && alert.occurred_at < tomorrow);
    }

    alerts = alerts.filter(alert => startAt <= new Date(alert.occurred_at));

    if (this.isValidDate(endAt))
      alerts = alerts.filter(alert => endAt > new Date(alert.occurred_at));

    return alerts;
  }

  private getWhereByStatus(status: number, customer_id: string): any {
    return isNaN(status)
      ? { customer_id: customer_id }
      : {
        customer_id: customer_id,
        is_enabled: !!status
      };
  }

  private isValidDate = (date: Date | string) => date !== INVALID_DATE;
}
