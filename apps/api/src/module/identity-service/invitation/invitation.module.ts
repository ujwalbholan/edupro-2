import { Module } from '@nestjs/common';
import { InvitationController } from './presentation/invitation.controller';
import { InvitationService } from './application/invitation.service';
import { InvitationalRepository } from './infrastructure/invitation.repository';

@Module({
  controllers: [InvitationController],
  providers: [InvitationService, InvitationalRepository],
  exports: [InvitationService],
})
export class InvitationModule {}
