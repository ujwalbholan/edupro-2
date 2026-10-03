import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendInvitationEmail(parms: {
    email: string;
    tenantName: string;
    invitationToken: string;
  }) {
    const { email, tenantName, invitationToken } = parms;

    const invitationUrl = `${process.env.FRONTEND_URL}/accept-invitation?token=${invitationToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: `Invitation to Join ${tenantName}`,
      html: `
        <h2>You're invited!</h2>

        <p>
          You have been invited to join
          <strong>${tenantName}</strong>.
        </p>

        <p>
          <a href="${invitationUrl}">
            Accept Invitation
          </a>
        </p>

        <p>This invitation expires in 24 hours.</p>
      `,
    });
  }
}
