import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findTenant(tenantId: string) {
    return this.prismaService.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true },
    });
  }

  async list(tenantId: string) {
    return this.prismaService.role.findMany({
      where: { tenantId },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(tenantId: string, roleId: string) {
    return this.prismaService.role.findFirst({
      where: { id: roleId, tenantId },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });
  }

  async findByTenantAndName(tenantId: string, name: string) {
    return this.prismaService.role.findFirst({
      where: { tenantId, name },
    });
  }

  async create(data: {
    tenantId: string;
    name: string;
    description: string | null;
  }) {
    return this.prismaService.role.create({
      data,
    });
  }

  async update(
    roleId: string,
    data: { name: string; description: string | null },
  ) {
    return this.prismaService.role.update({
      where: { id: roleId },
      data,
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });
  }

  async remove(roleId: string) {
    return this.prismaService.role.delete({
      where: { id: roleId },
    });
  }

  async listPermissions(roleId: string) {
    return this.prismaService.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
      orderBy: { permission: { code: 'asc' } },
    });
  }

  async setPermissions(roleId: string, permissionCodes: string[]) {
    const normalizedCodes = [
      ...new Set(permissionCodes.map((code) => code.trim())),
    ].filter(Boolean);

    if (normalizedCodes.length === 0) {
      await this.prismaService.rolePermission.deleteMany({ where: { roleId } });
      return [];
    }

    const permissions = await this.prismaService.permission.findMany({
      where: { code: { in: normalizedCodes } },
    });

    const foundCodes = new Set(
      permissions.map((permission) => permission.code),
    );
    const missing = normalizedCodes.filter((code) => !foundCodes.has(code));

    if (missing.length > 0) {
      throw new BadRequestException(
        `Unknown permissions: ${missing.join(', ')}`,
      );
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } });
      await tx.rolePermission.createMany({
        data: permissions.map((permission) => ({
          roleId,
          permissionId: permission.id,
        })),
      });
    });

    return this.listPermissions(roleId);
  }
}
