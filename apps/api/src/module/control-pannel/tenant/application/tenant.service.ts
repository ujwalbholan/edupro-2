import { Injectable } from '@nestjs/common';
import { TenantPrismaRepository } from '../infrastructure/tenant-Prisma.repository';
import { TenantStatus } from '@repo/database-config/dist/generated/prisma/enums';
import { generateSlug } from '../utils/generateSlug';
import { CreateTenantData } from '../types/CreateTenantTypes';
import { Tenant } from '@repo/database-config/dist/generated/prisma/client';
import { UpdateTenantDto } from '../presentation/dto/update-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    private readonly tenantPrismaRepository: TenantPrismaRepository,
  ) {}

  async create(data: CreateTenantData) {
    const baseSlug = generateSlug(data.name);
    const slug = await this.generateUniqueSlug(baseSlug);

    const tenant = {
      name: data.name,
      slug,
      institutionType: data.institutionType,
      status: TenantStatus.PENDING_SETUP,
    };

    return this.tenantPrismaRepository.create(tenant);
  }

  async get(): Promise<Tenant[]> {
    return this.tenantPrismaRepository.get();
  }

  async findByID(id: string): Promise<Tenant | null> {
    return this.tenantPrismaRepository.findById(id);
  }

  async updateTenant(
    tenantId: string,
    tenantData: UpdateTenantDto,
  ): Promise<Tenant | null> {
    return this.tenantPrismaRepository.updateTenant(tenantId, tenantData);
  }
  async removeTenant(id: string) {
    return this.tenantPrismaRepository.removeTenant(id);
  }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (await this.tenantPrismaRepository.findBySlug(slug)) {
      counter++;

      slug = `${baseSlug}-${counter}`;
    }
    return slug;
  }
}
