import { Module } from '@nestjs/common';
import { InvitationController } from './presentation/invitation.controller';
import { InvitationService } from './application/invitation.service';

@Module({
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}
