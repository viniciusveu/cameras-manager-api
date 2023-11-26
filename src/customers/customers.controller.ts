import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Customer } from './customers.entity';
import { CustomersService } from './customers.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCustomerDto } from './customers.dto';

@ApiTags('customers')
@Controller('customers')
@ApiBearerAuth()
export class CustomersController {
    constructor(
        private readonly customersService: CustomersService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Lista clientes' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 500, description: 'InternalServerError.' })
    @ApiResponse({ status: 200, description: 'OK.', type: Customer, isArray: true })
    async findAll(): Promise<Customer[]> {
        return await this.customersService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Busca um cliente' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 500, description: 'InternalServerError.' })
    @ApiResponse({ status: 200, description: 'OK.', type: Customer })
    async findOne(@Param('id') id: string): Promise<Customer> {
        return await this.customersService.findById(id);
    }

    @Get(':id/cameras')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Busca as câmeras de um cliente' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 500, description: 'InternalServerError.' })
    @ApiResponse({ status: 200, description: 'OK.', type: Customer })
    async findCameras(
        @Param('id') id: string
    ): Promise<Customer> {
        return await this.customersService.findCameras(id);
    }

    @Post()
    @ApiOperation({ summary: 'Cria um cliente' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 400, description: 'BadRequest.' })
    @ApiResponse({ status: 201, description: 'Created.', type: Customer })
    async create(@Body() customer: CreateCustomerDto): Promise<Customer> {
        return await this.customersService.create(customer as Customer);
    };
}
