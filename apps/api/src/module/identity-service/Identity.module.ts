import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { InvitationModule } from './invitation/invitation.module';

@Module({
  imports: [UserModule, InvitationModule],
})
export class IdentityModule {}
