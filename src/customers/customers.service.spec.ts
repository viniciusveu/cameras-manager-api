import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { Customer } from './customers.entity';
import { Repository } from 'typeorm';

describe('CustomersService', () => {
  let service: CustomersService;
  let repo: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: getRepositoryToken(Customer), useClass: Repository },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repo = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const result = [new Customer('Customer1'), new Customer('Customer1')];
      jest.spyOn(repo, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('create', () => {
    it('should return a customer', async () => {
      const result = new Customer('Customer1');
      jest.spyOn(repo, 'save').mockResolvedValue(result);

      expect(await service.create(result)).toBe(result);
    });
  });

  describe('findByName', () => {
    it('should return a customer', async () => {
      const result = new Customer('Customer1');
      jest.spyOn(repo, 'findOne').mockResolvedValue(result);

      expect(await service.findByName('Customer1')).toBe(result);
    });
  });

  describe('findById', () => {
    it('should return a customer', async () => {
      const result = new Customer('Customer1');
      jest.spyOn(repo, 'findOne').mockResolvedValue(result);

      expect(await service.findById('1')).toBe(result);
    });
  });

  describe('countAll', () => {
    it('should return a number', async () => {
      const result = 1;
      jest.spyOn(repo, 'count').mockResolvedValue(result);

      expect(await service.countAll()).toBe(result);
    });
  });

  describe('createCustomersIfEmpty', () => {
    it('should create a customer', async () => {
      const result = new Customer('Customer1');
      jest.spyOn(repo, 'count').mockResolvedValue(0);
      jest.spyOn(repo, 'save').mockResolvedValue(result);

      expect(await service.createCustomersIfEmpty([result])).toBe(undefined);
    });
  });

  describe('findCameras', () => {
    it('should return a customer', async () => {
      const result = new Customer('Customer1');
      jest.spyOn(repo, 'findOne').mockResolvedValue(result);

      expect(await service.findCameras('1')).toBe(result);
    });
  });

});
