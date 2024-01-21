import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from './customers.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>
  ) { }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findByName(name: string): Promise<Customer | undefined> {
    return this.customerRepository.findOne({
      where: {
        name
      }
    });
  }

  async findById(id: string): Promise<Customer | undefined> {
    return this.customerRepository.findOne({
      where: {
        id
      }
    });
  }

  async countAll(): Promise<number | undefined> {
    return this.customerRepository.count();
  }

  async createCustomersIfEmpty(customersData: any[]): Promise<void> {
    const databaseCount = await this.customerRepository.count();

    if (!databaseCount)
      for (const customerData of customersData) {
        const customer = new Customer(customerData.name, customerData.password);
        await this.customerRepository.save(customer);
      }

  };

  async findCameras(id: string): Promise<Customer | undefined> {
    return this.customerRepository.findOne({
      where: {
        id
      },
      relations: ['cameras']
    });
  }

  async create(customer: Customer): Promise<Customer> {
    return await this.customerRepository.save(customer);
  }
}
