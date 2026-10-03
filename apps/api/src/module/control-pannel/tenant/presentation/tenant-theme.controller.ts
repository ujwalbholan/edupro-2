import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ZodValidatorPipe } from 'src/common/pipline/zod-validator.pipline';
import { TenantThemeService } from '../application/tenant-theme.service';
import { TenantThemeDto, TenantThemeSchema } from './dto/tenant-theme.dto';

@Controller('tenants/:tenantId')
export class TenantThemeController {
  constructor(private readonly tenantThemeService: TenantThemeService) {}

  @Get('theme')
  async getTheme(@Param('tenantId') tenantId: string) {
    return this.tenantThemeService.getOrCreate(tenantId);
  }

  @Patch('theme')
  async updateTheme(
    @Param('tenantId') tenantId: string,
    @Body(new ZodValidatorPipe(TenantThemeSchema))
    data: TenantThemeDto,
  ) {
    return this.tenantThemeService.update(tenantId, data);
  }
}
