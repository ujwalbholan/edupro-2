import { Module } from '@nestjs/common';
import { TenantController } from './presentation/tenant.controller';
import { TenantService } from './application/tenant.service';
import { TenantPrismaRepository } from './infrastructure/tenant-Prisma.repository';
import { TenantDomainController } from './presentation/tenant-domain.controller';
import { TenantDomainService } from './application/tenant-domain.service';
import { TenantDomainPrismaRepository } from './infrastructure/tenant-domain-prisma.repository';

@Module({
  controllers: [TenantController, TenantDomainController],
  providers: [
    TenantService,
    TenantPrismaRepository,
    TenantDomainService,
    TenantDomainPrismaRepository,
  ],
  exports: [
    TenantService,
    TenantPrismaRepository,
    TenantDomainService,
    TenantDomainPrismaRepository,
  ],
})
export class TenantModule {}
