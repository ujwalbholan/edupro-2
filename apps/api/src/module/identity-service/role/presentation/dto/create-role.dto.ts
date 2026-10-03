import { z } from 'zod';

export const CreateRoleSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().max(200).optional().nullable(),
  permissionCodes: z.array(z.string().trim()).optional(),
});

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
