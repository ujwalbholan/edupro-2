import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';

@Injectable()
export class TenantUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getTenantAllUser(tenantId: string) {
    const tenant = this.prismaService.tenant.findUnique({
      where: {
        id: tenantId,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        institutionType: true,
        status: true,
        memberships: {
          select: {
            tenantId: true,
            userId: true,
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!tenant) {
      throw new NotAcceptableException('Tenent Not Found');
    }

    return tenant;
  }

  async getTenantUser(tenantId: string, userId: string) {
    return this.prismaService.tenant.findUnique({
      where: {
        id: tenantId,
        memberships: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        institutionType: true,
        status: true,
        memberships: {
          where: {
            userId: userId,
          },
          select: {
            tenantId: true,
            userId: true,
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
                status: true,
              },
            },
          },
        },
      },
    });
  }
}
