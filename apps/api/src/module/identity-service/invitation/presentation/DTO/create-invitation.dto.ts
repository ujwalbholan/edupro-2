import { z } from 'zod';

export const createInvitationSchema = z.object({
  email: z.email(),
  roleId: z.uuid(),
});

export type CreateInvitationDto = z.infer<typeof createInvitationSchema>;
