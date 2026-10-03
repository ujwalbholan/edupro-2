import { Module } from '@nestjs/common';
import { PermissionService } from './application/permission.service';
import { PermissionRepository } from './infrastructure/permission.repository';
import { PermissionController } from './presentation/permission.controller';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService, PermissionRepository],
})
export class PermissionModule {}
