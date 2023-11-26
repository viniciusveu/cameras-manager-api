import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AlertsService } from '../alerts/alerts.service';
import { Alert } from './alerts.entity';

describe('AlertsService', () => {
  let alertsService: AlertsService;

  const mockAlertRepository = {
    save: jest.fn(),
    find: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        {
          provide: getRepositoryToken(Alert),
          useValue: mockAlertRepository
        },
      ],
    }).compile();

    alertsService = module.get<AlertsService>(AlertsService);
  });

  it('should be defined', () => {
    expect(alertsService).toBeDefined();
  });

});
