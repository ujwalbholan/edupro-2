import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';
import { Prisma } from '@repo/database-config/dist/generated/prisma/client';

type TenantSettingsUpsertInput = Omit<
  Prisma.TenantSettingsUncheckedCreateInput,
  'tenantId' | 'id' | 'createdAt' | 'updatedAt'
>;

@Injectable()
export class TenantSettingsPrismaRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByTenantId(tenantId: string) {
    return this.prismaService.tenantSettings.findUnique({
      where: { tenantId },
    });
  }

  async upsert(tenantId: string, data: TenantSettingsUpsertInput) {
    return this.prismaService.tenantSettings.upsert({
      where: { tenantId },
      create: {
        tenantId,
        ...data,
      },
      update: { ...data },
    });
  }
}
