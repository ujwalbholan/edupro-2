import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionRepository } from '../infrastructure/permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async list() {
    return this.permissionRepository.list();
  }

  async getById(permissionId: string) {
    const permission = await this.permissionRepository.findById(permissionId);

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }
}
