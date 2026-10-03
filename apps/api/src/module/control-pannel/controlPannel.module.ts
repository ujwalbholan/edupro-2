import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { FeatureModule } from './feature/feature.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TenantModule } from './tenant/tenant.module';
import { TenantUserModule } from './tenant-users/tenant-user.module';

@Module({
  imports: [
    TenantModule,
    TenantUserModule,
    SubscriptionModule,
    FeatureModule,
    AuditLogModule,
    AdminModule,
  ],
})
export class ControlPanelModule {}
