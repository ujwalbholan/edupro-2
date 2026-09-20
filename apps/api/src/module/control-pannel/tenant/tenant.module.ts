import { Module } from '@nestjs/common';
import { TenantController } from './presentation/tenant.controller';
import { TenantService } from './application/tenant.service';
import { TenantPrismaRepository } from './infrastructure/tenant-Prisma.repository';

@Module({
  controllers: [TenantController],
  providers: [TenantService, TenantPrismaRepository],
  exports: [TenantService, TenantPrismaRepository],
})
export class TenantModule {}
