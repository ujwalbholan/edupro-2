import { Module } from '@nestjs/common';
import { TenantController } from './presentation/tenant.controller';
import { TenantService } from './application/tenant.service';
import { TenantPrismaRepository } from './infrastructure/tenant-Prisma.repository';
import { TenantDomainController } from './presentation/tenant-domain.controller';
import { TenantDomainService } from './application/tenant-domain.service';
import { TenantDomainPrismaRepository } from './infrastructure/tenant-domain-prisma.repository';
import { TenantSettingsController } from './presentation/tenant-settings.controller';
import { TenantSettingsService } from './application/tenant-settings.service';
import { TenantSettingsPrismaRepository } from './infrastructure/tenant-settings-prisma.repository';
import { TenantThemeController } from './presentation/tenant-theme.controller';
import { TenantThemeService } from './application/tenant-theme.service';
import { TenantThemePrismaRepository } from './infrastructure/tenant-theme-prisma.repository';

@Module({
  controllers: [
    TenantController,
    TenantDomainController,
    TenantSettingsController,
    TenantThemeController,
  ],
  providers: [
    TenantService,
    TenantPrismaRepository,
    TenantDomainService,
    TenantDomainPrismaRepository,
    TenantSettingsService,
    TenantSettingsPrismaRepository,
    TenantThemeService,
    TenantThemePrismaRepository,
  ],
  exports: [
    TenantService,
    TenantPrismaRepository,
    TenantDomainService,
    TenantDomainPrismaRepository,
    TenantSettingsService,
    TenantSettingsPrismaRepository,
    TenantThemeService,
    TenantThemePrismaRepository,
  ],
})
export class TenantModule {}
