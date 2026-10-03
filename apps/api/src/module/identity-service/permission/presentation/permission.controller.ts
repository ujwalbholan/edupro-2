import { Controller, Get, Param } from '@nestjs/common';
import { PermissionService } from '../application/permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async list() {
    return this.permissionService.list();
  }

  @Get(':permissionId')
  async getById(@Param('permissionId') permissionId: string) {
    return this.permissionService.getById(permissionId);
  }
}
