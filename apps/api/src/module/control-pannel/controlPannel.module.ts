import { Module } from '@nestjs/common';
import { TenantModule } from './tenant/tenant.module';
import { TenantUserModule } from './tenant-users/tenant-user.module';

@Module({
  imports: [TenantModule, TenantUserModule],
})
export class ControlPanelModule {}
