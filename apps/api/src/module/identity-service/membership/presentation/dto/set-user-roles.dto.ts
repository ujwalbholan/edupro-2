import { z } from 'zod';

export const SetUserRolesSchema = z.object({
  roleIds: z.array(z.string().uuid()).min(1),
});

export type SetUserRolesDto = z.infer<typeof SetUserRolesSchema>;
