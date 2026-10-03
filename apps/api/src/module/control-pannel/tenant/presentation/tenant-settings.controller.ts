import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ZodValidatorPipe } from 'src/common/pipline/zod-validator.pipline';
import { TenantSettingsService } from '../application/tenant-settings.service';
import {
  TenantSettingsDto,
  TenantSettingsSchema,
} from './dto/tenant-settings.dto';

@Controller('tenants/:tenantId')
export class TenantSettingsController {
  constructor(private readonly tenantSettingsService: TenantSettingsService) {}

  @Get('settings')
  async getSettings(@Param('tenantId') tenantId: string) {
    return this.tenantSettingsService.getOrCreate(tenantId);
  }

  @Patch('settings')
  async updateSettings(
    @Param('tenantId') tenantId: string,
    @Body(new ZodValidatorPipe(TenantSettingsSchema))
    data: TenantSettingsDto,
  ) {
    return this.tenantSettingsService.update(tenantId, data);
  }
}
