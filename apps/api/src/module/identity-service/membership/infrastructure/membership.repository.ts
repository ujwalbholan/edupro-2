import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';

@Injectable()
export class MembershipRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findTenant(tenantId: string) {
    return this.prismaService.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true },
    });
  }

  async list(tenantId: string) {
    return this.prismaService.tenantUser.findMany({
      where: { tenantId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            status: true,
          },
        },
        roles: {
          include: { role: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByUserId(tenantId: string, userId: string) {
    return this.prismaService.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
      include: {
        user: true,
        roles: { include: { role: true } },
      },
    });
  }

  async createMembership(data: { tenantId: string; userId: string }) {
    return this.prismaService.tenantUser.create({
      data,
    });
  }

  async findRolesByIds(tenantId: string, roleIds: string[]) {
    return this.prismaService.role.findMany({
      where: {
        id: { in: roleIds },
        tenantId,
      },
    });
  }

  async setUserRoles(tenantUserId: string, roleIds: string[]) {
    await this.prismaService.$transaction(async (tx) => {
      await tx.tenantUserRole.deleteMany({ where: { tenantUserId } });

      if (roleIds.length === 0) {
        return;
      }

      await tx.tenantUserRole.createMany({
        data: roleIds.map((roleId) => ({
          tenantUserId,
          roleId,
        })),
      });
    });

    return this.prismaService.tenantUserRole.findMany({
      where: { tenantUserId },
      include: { role: true },
    });
  }

  async listUserRoles(tenantId: string, userId: string) {
    const membership = await this.findByUserId(tenantId, userId);

    if (!membership) {
      throw new BadRequestException('User is not a member of this tenant');
    }

    return this.prismaService.tenantUserRole.findMany({
      where: { tenantUserId: membership.id },
      include: { role: true },
      orderBy: { assignedAt: 'asc' },
    });
  }
}
