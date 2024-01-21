import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all users', async () => {
    const testUsers: User[] = [new User(), new User()];
    jest.spyOn(repo, 'find').mockResolvedValue(testUsers);

    expect(await service.findAll()).toEqual(testUsers);
  });

  it('should find a user by id', async () => {
    const testUser: User = new User();
    jest.spyOn(repo, 'findOne').mockResolvedValue(testUser);

    expect(await service.findById('1')).toEqual(testUser);
  });

  it('should find a user by name', async () => {
    const testUser: User = new User();
    jest.spyOn(repo, 'findOne').mockResolvedValue(testUser);

    expect(await service.findByName('test')).toEqual(testUser);
  });

  it('should throw an error if a user does not exist', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);

    await expect(service.remove('test')).rejects.toThrow();
    await expect(service.update('test', new User())).rejects.toThrow();
  });

  it('should throw an error if a user already exists', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(new User());

    await expect(service.create(new User())).rejects.toThrow();  
  });
});