import { z } from 'zod';

export const UpdateRoleSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().max(200).optional().nullable(),
});

export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;
