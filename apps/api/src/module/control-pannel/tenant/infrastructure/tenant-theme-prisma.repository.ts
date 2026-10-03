import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';
import { Prisma } from '@repo/database-config/dist/generated/prisma/client';

type TenantThemeUpsertInput = Omit<
  Prisma.TenantThemeUncheckedCreateInput,
  'tenantId' | 'id' | 'createdAt' | 'updatedAt'
>;

@Injectable()
export class TenantThemePrismaRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByTenantId(tenantId: string) {
    return this.prismaService.tenantTheme.findUnique({
      where: { tenantId },
    });
  }

  async upsert(tenantId: string, data: TenantThemeUpsertInput) {
    return this.prismaService.tenantTheme.upsert({
      where: { tenantId },
      create: {
        tenantId,
        ...data,
      },
      update: { ...data },
    });
  }
}
