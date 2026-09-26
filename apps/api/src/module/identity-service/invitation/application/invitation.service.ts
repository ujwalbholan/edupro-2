import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { InvitationalRepository } from '../infrastructure/invitation.repository';
import { MailService } from '../../mail/mail.service';
import { InvitationStatus } from '@repo/database-config/dist/generated/prisma/enums';

@Injectable()
export class InvitationService {
  constructor(
    private readonly invitationRepository: InvitationalRepository,
    private readonly mailService: MailService,
  ) {}

  async create(data: {
    tenantId: string;
    email: string;
    roleId: string;
    invitedByUserId: string;
  }) {
    const email = data.email.toLowerCase().trim();

    const tenant = await this.invitationRepository.findTenant(data.tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const inviter = await this.invitationRepository.findInviter(
      data.tenantId,
      data.invitedByUserId,
    );

    if (!inviter) {
      throw new ForbiddenException('You are not a member of this tenant');
    }

    const role = await this.invitationRepository.findRole(
      data.tenantId,
      data.roleId,
    );

    if (!role) {
      throw new BadRequestException('Role does not belong to this tenant');
    }

    console.log(role);
    const invitationToken = randomBytes(32).toString('base64url');

    const tokenHash = createHash('sha256')
      .update(invitationToken)
      .digest('hex');

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const existing = await this.invitationRepository.findByTenantAndEmail(
      data.tenantId,
      email,
    );

    let invitation;

    if (existing) {
      invitation = await this.invitationRepository.update(existing.id, {
        roleId: data.roleId,
        invitedByUserId: data.invitedByUserId,
        tokenHash,
        status: InvitationStatus.PENDING,
        expiresAt,
        acceptedAt: null,
        revokedAt: null,
      });
    } else {
      invitation = await this.invitationRepository.create({
        tenantId: data.tenantId,
        email,
        roleId: data.roleId,
        invitedByUserId: data.invitedByUserId,
        tokenHash,
        status: InvitationStatus.PENDING,
        expiresAt,
      });
    }

    await this.mailService.sendInvitationEmail({
      email,
      tenantName: tenant.name,
      invitationToken,
    });

    return {
      id: invitation.id,
      email: invitation.email,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      tenant: invitation.tenant,
      role: invitation.role,
    };
  }
}
