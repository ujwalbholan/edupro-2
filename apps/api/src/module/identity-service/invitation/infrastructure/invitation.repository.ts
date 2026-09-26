import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';
import { Prisma } from '@repo/database-config/dist/generated/prisma/client';

@Injectable()
export class InvitationalRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findTenant(tenantId: string) {
    return await this.prismaService.tenant.findUnique({
      where: {
        id: tenantId,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findRole(tenantId: string, roleId: string) {
    return await this.prismaService.role.findFirst({
      where: {
        id: roleId,
      },
      select: {
        id: true,
        name: true,
        tenantId: true,
      },
    });
  }

  async findInviter(tenantId: string, userId: string) {
    return await this.prismaService.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });
  }

  async findByTenantAndEmail(tenantId: string, email: string) {
    return await this.prismaService.invitation.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email,
        },
      },
    });
  }

  async create(data: Prisma.InvitationUncheckedCreateInput) {
    return await this.prismaService.invitation.create({
      data,
      include: {
        tenant: {
          select: {
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.InvitationUncheckedUpdateInput) {
    return await this.prismaService.invitation.update({
      where: {
        id,
      },
      data,
      include: {
        tenant: {
          select: {
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
