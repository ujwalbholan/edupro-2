import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { InvitationalRepository } from '../infrastructure/invitation.repository';
import { CreateInvitationDto } from '../presentation/DTO/create-invitation.dto';

@Injectable()
export class InvitationService {
  constructor(private readonly invitationRepository: InvitationalRepository) {}

  async create(data: CreateInvitationDto) {
    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await this.invitationRepository.create({
      tenantId: data.tenantId,
      email: data.email.toLowerCase(),
      roleId: data.roleId,
      invitedByUserId: data.invitedByUserId,
      tokenHash,
      expiresAt,
    });

    // Send `token` through the email provider; never persist or log it.
    return { invitation, token };
  }
}
