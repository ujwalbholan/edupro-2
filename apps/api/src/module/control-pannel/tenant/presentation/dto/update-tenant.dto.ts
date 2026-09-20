import { CreateTenantSchema } from './create-tenant.dto';
import z from 'zod';

export const UpdateTenantSchema = CreateTenantSchema.partial({
  name: true,
  institutionType: true,
  status: true,
});

export type UpdateTenantDto = z.infer<typeof UpdateTenantSchema>;
