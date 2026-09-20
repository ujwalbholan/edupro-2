import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';
import { CreateTenantDTO } from '../presentation/dto/create-tenant.dto';
import { TenantRepository } from '../domain/tenant.Irepository';
import { Tenant } from '@repo/database-config/dist/generated/prisma/client';

@Injectable()
export class TenantPrismaRepository implements TenantRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    tenant: Omit<CreateTenantDTO, 'slug'> & { slug: string },
  ): Promise<Tenant> {
    const tenantData = await this.prismaService.tenant.create({
      data: tenant,
    });

    return tenantData;
  }

  findById(id: string): Promise<Tenant | null> {
    throw new Error('Method not implemented.');
  }
  findBySlug(slug: string): Promise<Tenant | null> {
    throw new Error('Method not implemented.');
  }
}
