import { Module } from '@nestjs/common';
import { InvitationController } from './presentation/invitation.controller';
import { InvitationService } from './application/invitation.service';
import { InvitationalRepository } from './infrastructure/invitation.repository';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [InvitationController],
  providers: [InvitationService, InvitationalRepository],
  exports: [InvitationService],
})
export class InvitationModule {}
