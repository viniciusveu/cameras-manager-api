import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { CreateUserDto } from './users.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    service = { findAll: jest.fn(), findById: jest.fn(), create: jest.fn(), update: jest.fn(), remove: jest.fn() } as any;
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: service }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should return all users', async () => {
    const result: User[] = [];
    jest.spyOn(service, 'findAll').mockResolvedValue(result);
    expect(await controller.findAll()).toBe(result);
  });

  it('should return one user', async () => {
    const result: User = { id: '1', name: 'Test User' };
    jest.spyOn(service, 'findById').mockResolvedValue(result);
    expect(await controller.findOne('1')).toBe(result);
  });

  it('should create a user', async () => {
    const result: User = { id: '1', name: 'Test User' };
    jest.spyOn(service, 'create').mockResolvedValue(result);
    const user: User = { id: '1', name: 'Test User' };
    expect(await controller.create(user as CreateUserDto)).toBe(result);
  });

  it('should update a user', async () => {
    jest.spyOn(service, 'update').mockResolvedValue();
    const user: User = new User();
    expect(await controller.update('1', user)).toBe(undefined);
  });

  it('should delete a user', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue();
    expect(await controller.remove('1')).toBe(undefined);
  });
});