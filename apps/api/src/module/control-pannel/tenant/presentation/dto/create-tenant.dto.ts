import {
  InstitutionType,
  TenantStatus,
} from '@repo/database-config/dist/generated/prisma/enums';
import { z } from 'zod';

export const CreateTenantSchema = z
  .object({
    name: z
      .string('Name is required')
      .trim()
      .min(2, 'Minimum 2 character')
      .max(100, 'Max 100 Character'),

    institutionType: z.preprocess(
      (value) => (typeof value === 'string' ? value.toUpperCase() : value),
      z.enum(InstitutionType),
    ),

    slug: z
      .string()
      .trim()
      .min(2, 'Minimum 2 character')
      .max(100, 'Max 100 Character')
      .optional(),

    status: z.preprocess(
      (value) => (typeof value === 'string' ? value.toUpperCase() : value),
      z.enum(TenantStatus).optional(),
    ),
  })
  .strict();

export type CreateTenantDTO = z.infer<typeof CreateTenantSchema>;
