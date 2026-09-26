import { Module } from '@nestjs/common';
import { TenantUserController } from './presentation/tanant-user.controller';
import { TenantUserService } from './application/tenant-user.service';
import { TenantUserRepository } from './infrastructure/tenant-user.repository';

@Module({
  exports: [TenantUserService, TenantUserRepository],
  providers: [TenantUserService, TenantUserRepository],
  controllers: [TenantUserController],
})
export class TenantUserModule {}
