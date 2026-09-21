import { z } from 'zod';

export const createInvitationSchema = z.object({
  tenantId: z.uuid(),
  email: z.email(),
  roleId: z.uuid(),
  invitedByUserId: z.uuid(),
});

export type CreateInvitationDto = z.infer<typeof createInvitationSchema>;
