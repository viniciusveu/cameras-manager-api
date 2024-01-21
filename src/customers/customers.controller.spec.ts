import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { Customer } from './customers.entity';
import { CustomersService } from './customers.service';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  beforeEach(async () => {
    service = { findAll: jest.fn(), findById: jest.fn(), findCameras: jest.fn(), create: jest.fn() } as any;
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [{ provide: CustomersService, useValue: service }],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const result = [new Customer('Customer1'), new Customer('Customer1')];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a customer', async () => {
      const result = new Customer('Customer1');
      jest.spyOn(service, 'findById').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('findCameras', () => {
    it('should return a customer', async () => {
      const result = new Customer('Customer1');
      jest.spyOn(service, 'findCameras').mockResolvedValue(result);

      expect(await controller.findCameras('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should return a customer', async () => {
      const result = new Customer('Customer1');
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create({password: '1', ...result})).toBe(result);
    });
  });
  
});
