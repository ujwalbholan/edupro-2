import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { InvitationModule } from './invitation/invitation.module';
import { MailModule } from './mail/mail.module';
import { RoleModule } from './role/role.module';
import { MembershipModule } from './membership/membership.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    UserModule,
    MailModule,
    InvitationModule,
    RoleModule,
    MembershipModule,
    PermissionModule,
  ],
})
export class IdentityModule {}
