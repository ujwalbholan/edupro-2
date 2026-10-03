import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from '../infrastructure/role.repository';

export type CreateRoleInput = {
  name: string;
  description?: string | null;
  permissionCodes?: string[];
};

export type UpdateRoleInput = {
  name?: string;
  description?: string | null;
};

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async list(tenantId: string) {
    return this.roleRepository.list(tenantId);
  }

  async getById(tenantId: string, roleId: string) {
    const role = await this.roleRepository.findById(tenantId, roleId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async create(tenantId: string, data: CreateRoleInput) {
    const tenant = await this.roleRepository.findTenant(tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const name = data.name.trim();

    if (!name) {
      throw new BadRequestException('Role name is required');
    }

    const existing = await this.roleRepository.findByTenantAndName(
      tenantId,
      name,
    );

    if (existing) {
      throw new BadRequestException('Role already exists for this tenant');
    }

    const role = await this.roleRepository.create({
      tenantId,
      name,
      description: data.description ?? null,
    });

    if (data.permissionCodes && data.permissionCodes.length > 0) {
      await this.roleRepository.setPermissions(role.id, data.permissionCodes);
    }

    return this.roleRepository.findById(tenantId, role.id);
  }

  async update(tenantId: string, roleId: string, data: UpdateRoleInput) {
    const role = await this.getById(tenantId, roleId);

    const nextName = data.name?.trim();

    if (nextName) {
      const duplicate = await this.roleRepository.findByTenantAndName(
        tenantId,
        nextName,
      );

      if (duplicate && duplicate.id !== role.id) {
        throw new BadRequestException('Role already exists for this tenant');
      }
    }

    return this.roleRepository.update(roleId, {
      name: nextName ?? role.name,
      description: data.description ?? role.description,
    });
  }

  async remove(tenantId: string, roleId: string) {
    await this.getById(tenantId, roleId);
    return this.roleRepository.remove(roleId);
  }

  async listPermissions(tenantId: string, roleId: string) {
    await this.getById(tenantId, roleId);
    return this.roleRepository.listPermissions(roleId);
  }

  async setPermissions(
    tenantId: string,
    roleId: string,
    permissionCodes: string[],
  ) {
    await this.getById(tenantId, roleId);
    return this.roleRepository.setPermissions(roleId, permissionCodes);
  }
}
