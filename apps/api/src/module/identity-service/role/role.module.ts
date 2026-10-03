import { Module } from '@nestjs/common';
import { RoleService } from './application/role.service';
import { RoleRepository } from './infrastructure/role.repository';
import { RoleController } from './presentation/role.controller';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService, RoleRepository],
})
export class RoleModule {}
