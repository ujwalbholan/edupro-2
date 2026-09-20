import { Tenant } from '@repo/database-config/dist/generated/prisma/client';
import { CreateTenantDTO } from '../presentation/dto/create-tenant.dto';

export interface TenantRepository {
  create(tenant: CreateTenantDTO): Promise<Tenant | null>;
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
}
