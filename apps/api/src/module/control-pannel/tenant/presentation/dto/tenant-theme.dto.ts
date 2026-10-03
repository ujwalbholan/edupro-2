import { z } from 'zod';

export const TenantThemeSchema = z.object({
  primaryColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  secondaryColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  accentColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  logoUrl: z.string().trim().url().nullable().optional(),
  faviconUrl: z.string().trim().url().nullable().optional(),
  fontFamily: z.string().trim().min(2).max(50).optional(),
});

export type TenantThemeDto = z.infer<typeof TenantThemeSchema>;
