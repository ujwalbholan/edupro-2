import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { InvitationModule } from './invitation/invitation.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [UserModule, MailModule, InvitationModule],
})
export class IdentityModule {}
