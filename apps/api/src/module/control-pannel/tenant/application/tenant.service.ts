import { Injectable } from '@nestjs/common';
import { TenantPrismaRepository } from '../infrastructure/tenant-Prisma.repository';
import { CreateTenantDTO } from '../presentation/dto/create-tenant.dto';
import {
  InstitutionType,
  TenantStatus,
} from '@repo/database-config/dist/generated/prisma/enums';

@Injectable()
export class TenantService {
  constructor(private readonly tenanPrismaRepository: TenantPrismaRepository) {}

  async create(data: CreateTenantDTO) {
    const slug = `${data.name}.${data.institutionType}`;
    const tenant = {
      ...data,
      slug: slug,
      institutionType: data.institutionType.toUpperCase() as InstitutionType,
      status: data.status.toUpperCase() as TenantStatus,
    };
    return await this.tenanPrismaRepository.create(tenant);
  }
}
