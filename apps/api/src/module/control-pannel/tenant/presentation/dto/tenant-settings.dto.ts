import { z } from 'zod';

export const TenantSettingsSchema = z.object({
  locale: z.string().trim().min(2).max(20).optional(),
  timezone: z.string().trim().min(2).max(100).optional(),
  currency: z.string().trim().toUpperCase().min(3).max(10).optional(),
  dateFormat: z.string().trim().min(4).max(30).optional(),
});

export type TenantSettingsDto = z.infer<typeof TenantSettingsSchema>;
