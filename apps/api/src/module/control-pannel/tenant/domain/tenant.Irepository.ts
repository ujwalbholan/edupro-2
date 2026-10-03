import { Tenant } from '@repo/database-config/dist/generated/prisma/client';
import { CreateTenantData } from '../types/CreateTenantTypes';

export interface TenantRepository {
  create(data: CreateTenantData): Promise<Tenant>;
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
}
