import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers.entity';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Customer])],
    exports: [CustomersService],
    providers: [CustomersService],
    controllers: [CustomersController],
})
export class CustomersModule {}
