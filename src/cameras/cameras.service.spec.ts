import { Test, TestingModule } from '@nestjs/testing';
import { CamerasService } from './cameras.service';
import { Camera } from './cameras.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomersService } from '../customers/customers.service';
import { AlertsService } from '../alerts/alerts.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { afterEach } from 'node:test';

describe('CamerasService', () => {
  let camerasService: CamerasService;

  const mockCameraRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  const mockCustomerService = {
    findById: jest.fn(),
  };

  const mockAlertService = {
    createAlert: jest.fn(),
    getAllTodayAlerts: jest.fn(),
    findAlertsByCamera: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CamerasService,
        {
          provide: getRepositoryToken(Camera),
          useValue: mockCameraRepository
        },
        {
          provide: CustomersService,
          useValue: mockCustomerService
        },
        {
          provide: AlertsService,
          useValue: mockAlertService
        },
      ],
    }).compile();

    camerasService = module.get<CamerasService>(CamerasService);
  });

  it('should be defined', () => {
    expect(camerasService).toBeDefined();
  });

  describe('createACamera', () => {
    test('should create a new camera and add to the database with success', async () => {
      const customer = {
        id: 'aa6fea45-5d23-4396-9f7a-27b60b248b86',
        name: 'Teste'
      };
      const camera: Camera = new Camera(
        'Camera Test',
        '192.168.0.1',
        customer.id
      );

      jest.spyOn(mockCustomerService, 'findById').mockResolvedValue(customer);
      jest.spyOn(mockCameraRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(mockCameraRepository, 'save').mockResolvedValue(camera);

      const result = await camerasService.createACamera(camera);

      expect(result).toBe(camera);
      expect(result.customer_id).toBe(customer.id);
      expect(mockCustomerService.findById).toHaveBeenCalledWith(camera.customer_id);
      expect(mockCameraRepository.findOne).toHaveBeenCalled();
      expect(mockCameraRepository.save).toHaveBeenCalledWith(camera);
    });

    test('should throw an error if the camera IP already exists for this user', async () => {
      const customer = {
        id: 'aa6fea45-5d23-4396-9f7a-27b60b248b86',
        name: 'Teste'
      };
      const cameraToCreate: Camera = new Camera(
        'Camera Test',
        '192.168.0.1',
        customer.id
      );
      const cameraSameIp: Camera = new Camera(
        'Camera Test 2',
        cameraToCreate.ip,
        customer.id
      );

      jest.spyOn(mockCustomerService, 'findById').mockResolvedValue(customer);
      jest.spyOn(mockCameraRepository, 'findOne').mockResolvedValue(cameraSameIp);
      jest.spyOn(mockCameraRepository, 'save');

      try {
        await camerasService.createACamera(cameraToCreate);
        fail('Camera with same IP already exists for this customer');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });

    test('should throw an error if crelated customer does not exist', async () => {
      const cameraToCreate: Camera = new Camera(
        'Camera Test',
        '192.168.0.1',
        'aa6fea45-5d23-4396-9f7a-27b60b248b86'
      );

      jest.spyOn(mockCustomerService, 'findById').mockResolvedValue(null);

      try {
        await camerasService.createACamera(cameraToCreate);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(mockCameraRepository.find).toHaveBeenCalledTimes(0);
      }
    });

  });

  describe('findCameraByCustomer', () => {
    test('should return a camera list by customer (empty or not)', async () => {
      const customer = {
        id: 'aa6fea45-5d23-4396-9f7a-27b60b248b86',
        name: 'Teste'
      };
      const cameras: Camera[] = [
        new Camera(
          'Camera Test 1',
          '192.168.0.1',
          customer.id
        ),
        new Camera(
          'Camera Test 2',
          '192.168.0.2',
          customer.id
        )
      ]
      cameras[0].switch();

      jest.spyOn(mockCustomerService, 'findById').mockResolvedValue(customer);
      jest.spyOn(mockCameraRepository, 'find').mockResolvedValue(cameras);

      const result = await camerasService.findCameraByCustomer(customer.id);

      expect(mockCustomerService.findById).toHaveBeenCalled();
      expect(mockCameraRepository.find).toBeCalledWith({
        where: { customer_id: customer.id }
      });
      expect(result).toBeInstanceOf(Array);
    });

    test('should return a list of activated cameras by customer (empty or not)', async () => {
      const customer = {
        id: 'aa6fea45-5d23-4396-9f7a-27b60b248b86',
        name: 'Teste'
      };
      const cameras: Camera[] = [
        new Camera(
          'Camera Test 1',
          '192.168.0.1',
          customer.id
        ),
        new Camera(
          'Camera Test 2',
          '192.168.0.2',
          customer.id
        )
      ]
      cameras[0].switch();

      jest.spyOn(mockCustomerService, 'findById').mockResolvedValue(customer);
      jest.spyOn(mockCameraRepository, 'find').mockResolvedValue([cameras[1]]);

      const result = await camerasService.findCameraByCustomer(customer.id, 1);

      expect(mockCameraRepository.find).toBeCalledWith({
        where: { customer_id: customer.id, is_enabled: true }
      });
      expect(result[0].is_enabled).toBe(true);
    });

    test('should return a list of inactivated cameras by customer (empty or not)', async () => {
      const customer = {
        id: 'aa6fea45-5d23-4396-9f7a-27b60b248b86',
        name: 'Teste'
      };
      const cameras: Camera[] = [
        new Camera(
          'Camera Test 1',
          '192.168.0.1',
          customer.id
        ),
        new Camera(
          'Camera Test 2',
          '192.168.0.2',
          customer.id
        )
      ]
      cameras[0].switch();

      jest.spyOn(mockCustomerService, 'findById').mockResolvedValue(customer);
      jest.spyOn(mockCameraRepository, 'find').mockResolvedValue([cameras[0]]);

      const result = await camerasService.findCameraByCustomer(customer.id, 0);

      expect(mockCameraRepository.find).toBeCalledWith({
        where: { customer_id: customer.id, is_enabled: false }
      });
      expect(result[0].is_enabled).toBe(false);
    });

    test('should throw an error if related customer does not exist', async () => {
      const customer = {
        id: 'aa6fea45-5d23-4396-9f7a-27b60b248b86',
        name: 'Teste'
      };
      jest.spyOn(mockCustomerService, 'findById').mockResolvedValue(null);

      try {
        await camerasService.findCameraByCustomer(customer.id);
        fail('Customer not found');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('switchCameraStatus', () => {
    test('should update a camera and return the new object with success', async () => { });

    test('should throw an error if related camera does not exist', async () => { });
  });

  describe('createAlert', () => {
    test('should create a new alert and add to the database with success', async () => { });

    test('should throw an error if related camera does not exist', async () => { });
  });

  describe('findAlert', () => {
    test('should return list of alerts according to filters', async () => { });

    test('should throw an error if related camera does not exist', async () => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

});
