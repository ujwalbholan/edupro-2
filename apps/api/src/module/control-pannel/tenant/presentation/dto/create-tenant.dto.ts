import {
  InstitutionType,
  TenantStatus,
} from '@repo/database-config/dist/generated/prisma/enums';
import { z } from 'zod';

export const CreateTenantSchema = z.object({
  slug: z
    .string('slug is required')
    .min(2, 'Minimum 2 character')
    .max(100, 'Max 100 Character')
    .optional(),
  name: z
    .string('Name is required')
    .min(2, 'Minimum 2 character')
    .max(100, 'Max 100 Character'),

  institutionType: z.enum(InstitutionType),
  status: z.enum(TenantStatus),
});

export type CreateTenantDTO = z.infer<typeof CreateTenantSchema>;
