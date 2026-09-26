import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TenantService } from '../application/tenant.service';
import { CreateTenantSchema } from './dto/create-tenant.dto';
import { ZodValidatorPipe } from 'src/common/pipline/zod-validator.pipline';
import { CreateTenantData } from '../types/CreateTenantTypes';
import { Tenant } from '@repo/database-config/dist/generated/prisma/client';
import { UpdateTenantDto, UpdateTenantSchema } from './dto/update-tenant.dto';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('/')
  async createTenant(
    @Body(new ZodValidatorPipe(CreateTenantSchema))
    tenantPayload: CreateTenantData,
  ) {
    return this.tenantService.create(tenantPayload);
  }

  @Get('/')
  async getAllTenant(): Promise<Tenant[]> {
    return this.tenantService.get();
  }

  @Get(':id')
  async getTenentById(@Param('id') id: string): Promise<Tenant | null> {
    return this.tenantService.findByID(id);
  }

  @Patch(':id')
  async updateTenant(
    @Param('id') id: string,
    @Body(new ZodValidatorPipe(UpdateTenantSchema))
    tenantData: UpdateTenantDto,
  ): Promise<Tenant | null> {
    console.log(tenantData);
    return this.tenantService.updateTenant(id, tenantData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removeTenant(@Param('id') id: string) {
    return this.tenantService.removeTenant(id);
  }
}
