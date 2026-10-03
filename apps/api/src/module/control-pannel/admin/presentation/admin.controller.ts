import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { AdminService } from '../application/admin.service';
import {
  UpdateTenantDto,
  UpdateTenantSchema,
} from '../../tenant/presentation/dto/update-tenant.dto';
import { ZodValidatorPipe } from 'src/common/pipline/zod-validator.pipline';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('tenants')
  async listTenants() {
    return this.adminService.listTenants();
  }

  @Get('tenants/:tenantId')
  async getTenantById(@Param('tenantId') tenantId: string) {
    return this.adminService.getTenantById(tenantId);
  }

  @Patch('tenants/:tenantId')
  async updateTenant(
    @Param('tenantId') tenantId: string,
    @Body(new ZodValidatorPipe(UpdateTenantSchema))
    data: UpdateTenantDto,
  ) {
    return this.adminService.updateTenant(tenantId, data);
  }

  @Get('plans')
  async listPlans() {
    return this.adminService.listPlans();
  }

  @Get('features')
  async listFeatures() {
    return this.adminService.listFeatures();
  }
}
