import { z } from 'zod';

export const SetRolePermissionsSchema = z.object({
  permissionCodes: z.array(z.string().trim()).min(1),
});

export type SetRolePermissionsDto = z.infer<typeof SetRolePermissionsSchema>;
