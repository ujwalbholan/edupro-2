import { Controller, Get, Param } from '@nestjs/common';
import { TenantUserService } from '../application/tenant-user.service';

@Controller('tenants/:tenantId/users')
export class TenantUserController {
  constructor(private readonly tenantUserService: TenantUserService) {}

  @Get('/')
  async getTenantAllUser(@Param('tenantId') tenentId: string) {
    return this.tenantUserService.getTenantAllUser(tenentId);
  }

  @Get(':userId')
  async getTenantUser(
    @Param('tenantId') tenantid: string,
    @Param('userId') userId: string,
  ) {
    return this.tenantUserService.getTenantUser(tenantid, userId);
  }
}
