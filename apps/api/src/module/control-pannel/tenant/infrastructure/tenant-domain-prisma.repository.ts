import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';
import { Prisma } from '@repo/database-config/dist/generated/prisma/client';
import { DomainVerificationStatus } from '@repo/database-config/dist/generated/prisma/enums';

@Injectable()
export class TenantDomainPrismaRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByTenant(tenantId: string) {
    return this.prismaService.tenantDomain.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByTenantAndId(tenantId: string, domainId: string) {
    return this.prismaService.tenantDomain.findFirst({
      where: {
        id: domainId,
        tenantId,
      },
    });
  }

  async findByDomain(domain: string) {
    return this.prismaService.tenantDomain.findUnique({
      where: { domain },
    });
  }

  async create(data: Prisma.TenantDomainUncheckedCreateInput) {
    return this.prismaService.tenantDomain.create({
      data,
    });
  }

  async update(id: string, data: Prisma.TenantDomainUncheckedUpdateInput) {
    try {
      return await this.prismaService.tenantDomain.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException('Domain not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.tenantDomain.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException('Domain not found');
    }
  }

  async verify(id: string, data: Prisma.TenantDomainUncheckedUpdateInput) {
    try {
      return await this.prismaService.tenantDomain.update({
        where: { id },
        data: {
          ...data,
          verificationStatus:
            data.verificationStatus ?? DomainVerificationStatus.VERIFIED,
        },
      });
    } catch {
      throw new NotFoundException('Domain not found');
    }
  }

  async setPrimary(tenantId: string, domainId: string) {
    await this.prismaService.tenantDomain.updateMany({
      where: {
        tenantId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });

    try {
      return await this.prismaService.tenantDomain.update({
        where: {
          id: domainId,
          tenantId,
        },
        data: {
          isPrimary: true,
          verificationStatus: DomainVerificationStatus.VERIFIED,
        },
      });
    } catch {
      throw new NotFoundException('Domain not found for this tenant');
    }
  }
}
