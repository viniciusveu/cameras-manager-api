import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './users.dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @CacheTTL(20)
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @CacheKey('id')
    @CacheTTL(20)
    @ApiOperation({ summary: 'Retrieve a single user by their ID' })
    @ApiResponse({ status: 200, description: 'Success.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the user to retrieve' })
    findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiOperation({ summary: 'Retrieve all users' })
    @ApiResponse({ status: 201, description: 'Created.', type: User })
    @ApiResponse({ status: 400, description: 'BadRequest.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'NotFound.' })
    @ApiResponse({ status: 409, description: 'Conflict.' })
    @ApiBody({ type: CreateUserDto, description: 'The user to create' })
    create(@Body() user: CreateUserDto): Promise<User> {
        return this.usersService.create(user as User);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({ status: 200, description: 'Success.' })
    @ApiResponse({ status: 400, description: 'BadRequest.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'NotFound.' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the user to update' })
    @ApiBody({ type: User, description: 'The updated user' })
    update(@Param('id') id: string, @Body() user: User): Promise<void> {
        return this.usersService.update(id, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'Success.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'NotFound.' })
    @ApiParam({ name: 'id', required: true, description: 'The ID of the user to delete' })
    remove(@Param('id') id: string): Promise<void> {
        return this.usersService.remove(id);
    }
}