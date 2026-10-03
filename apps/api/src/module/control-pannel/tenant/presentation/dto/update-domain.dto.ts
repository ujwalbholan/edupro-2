import { z } from 'zod';
import { CreateDomainSchema } from './create-domain.dto';

export const UpdateDomainSchema = CreateDomainSchema.partial();

export type UpdateDomainDto = z.infer<typeof UpdateDomainSchema>;
