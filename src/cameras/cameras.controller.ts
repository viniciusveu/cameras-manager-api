import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { CamerasService } from './cameras.service';
import { Camera } from './cameras.entity';
import { AlertFilterDto, CreateCameraDto } from './cameras.dto';
import { Alert } from '../alerts/alerts.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('cameras')
@Controller('cameras')
@ApiBearerAuth()
export class CamerasController {
  constructor(private readonly cameraService: CamerasService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cria uma camera' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'NotFound.' })
  @ApiResponse({ status: 409, description: 'Conflict.' })
  @ApiResponse({ status: 400, description: 'BadRequest.' })
  @ApiResponse({ status: 201, description: 'Created.', type: Camera })
  async addCamera(@Body() createCameraDto: CreateCameraDto): Promise<Camera> {
    return await this.cameraService.createACamera(createCameraDto as Camera);
  }

  @Get('alerts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lista alertas' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'NotFound.' })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
  @ApiResponse({ status: 200, description: 'OK.', type: Alert, isArray: true })
  async listAlert(@Query() filterDto: AlertFilterDto): Promise<Alert[]> {
    return await this.cameraService.findAlerts(filterDto);
  }

  @Put(':camera_id/change-status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Desativa uma câmera' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'NotFound.' })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
  @ApiResponse({ status: 200, description: 'Updated.', type: Camera })
  async desablingCamera(
    @Param('camera_id') camera_id: string
  ): Promise<Camera> {
    return await this.cameraService.switchCameraStatus(camera_id);
  }

  @Post(':camera_id/alerts')
  @ApiOperation({ summary: 'Adiciona um alerta' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'NotFound.' })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
  @ApiResponse({ status: 201, description: 'Created.', type: Alert })
  @UseGuards(JwtAuthGuard) 
  async addAlert(@Param('camera_id') camera_id: string): Promise<Alert> {
    return await this.cameraService.createAlert(camera_id);
  }

  @Get(':customer_id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lista câmeras' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'NotFound.' })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
  @ApiResponse({ status: 200, description: 'OK.', type: Camera, isArray: true })
  async listCamera(
    @Param('customer_id') customer_id: string,
    @Query('status') status?: string
  ): Promise<Camera[]> {
    return await this.cameraService.findCameraByCustomer(customer_id, +status);
  }
}
