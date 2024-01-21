import { Test, TestingModule } from '@nestjs/testing';
import { CamerasService } from './cameras.service';
import { CamerasController } from './cameras.controller';
import { Camera } from './cameras.entity';
import { Alert } from '../alerts/alerts.entity';

describe('CamerasController', () => {
  let controller: CamerasController;
  let service: CamerasService;

  beforeEach(async () => {
    service = { createACamera: jest.fn(), findAlerts: jest.fn(), switchCameraStatus: jest.fn(), findCameraByCustomer: jest.fn(), createAlert: jest.fn() } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CamerasController],
      providers: [ 
        { provide: CamerasService, useValue: service },
      ],
    }).compile();

    controller = module.get<CamerasController>(CamerasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addCamera', () => {
    it('should return a camera', async () => {
      const result = new Camera('Camera1', '000.000.000.000', '1');
      jest.spyOn(service, 'createACamera').mockResolvedValue(result);

      expect(await controller.addCamera(result)).toBe(result);
    });
  });

  describe('listAlert', () => {
    it('should return a camera', async () => {
      const result = [new Alert('1')];
      jest.spyOn(service, 'findAlerts').mockResolvedValue(result);

      expect(await controller.listAlert({})).toBe(result);
    });
  });

  describe('desablingCamera', () => {
    it('should return a camera', async () => {
      const result = new Camera('Camera1', '000.000.000.000', '1');
      result.switch();
      jest.spyOn(service, 'switchCameraStatus').mockResolvedValue(result);

      expect(await controller.desablingCamera('1')).toBe(result);
    });
  });

  describe('listCamera', () => {
    it('should return a camera', async () => {
      const result = [new Camera('Camera1', '000.000.000.000', '1')];
      jest.spyOn(service, 'findCameraByCustomer').mockResolvedValue(result);

      expect(await controller.listCamera('1')).toBe(result);
    });
  });

  describe('addAlert', () => {
    it('should return a camera', async () => {
      const result = new Alert('1');
      jest.spyOn(service, 'createAlert').mockResolvedValue(result);

      expect(await controller.addAlert('1')).toBe(result);
    });
  });
  
});
