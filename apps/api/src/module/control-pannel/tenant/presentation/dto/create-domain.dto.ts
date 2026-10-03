import { DomainType } from '@repo/database-config/dist/generated/prisma/enums';
import { z } from 'zod';

export const CreateDomainSchema = z.object({
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Domain must be at least 3 characters')
    .max(255, 'Domain too long')
    .refine((value) => /^[a-z0-9.-]+$/.test(value), {
      message:
        'Domain may only contain lowercase letters, numbers, dots, and dashes',
    })
    .refine(
      (value) =>
        !value.startsWith('.') && !value.endsWith('.') && !value.includes('..'),
      {
        message: 'Domain format is invalid',
      },
    ),
  type: z
    .preprocess(
      (value) => (typeof value === 'string' ? value.toUpperCase() : value),
      z.enum(DomainType).optional(),
    )
    .optional(),
  isPrimary: z.boolean().optional(),
});

export type CreateDomainDto = z.infer<typeof CreateDomainSchema>;
