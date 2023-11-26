import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findById(id: string): Promise<User> {
        return await this.usersRepository.findOne({
            where: {
                id
            }
        });
    }

    async findByName(name: string): Promise<User> {
        return await this.usersRepository.findOne({
            where: {
                name
            }
        });
    }

    async remove(id: string): Promise<void> {
        const user = await this.findById(id);
        if (!user) throw new NotFoundException('User not found');

        await this.usersRepository.delete(id);
    }

    async create(user: User): Promise<User> {
        const userExists = await this.findByName(user.name); 
        if (userExists) throw new ConflictException('User already exists');
        
        return await this.usersRepository.save(user);
    }

    async update(id: string, user: User): Promise<void> {
        const userExists = await this.findById(id);
        if (!userExists) throw new NotFoundException('User not found');
        
        await this.usersRepository.update(id, user);
    }
}
