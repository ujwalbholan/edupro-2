import { Body, Controller, Param, Post } from '@nestjs/common';
import { ZodValidatorPipe } from 'src/common/pipline/zod-validator.pipline';
import {
  CreateInvitationDto,
  createInvitationSchema,
} from './DTO/create-invitation.dto';
import { InvitationService } from '../application/invitation.service';

@Controller('tenants/:tenantId')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post('invitations')
  async createInvitation(
    @Param('tenantId') tenantId: string,

    @Body(new ZodValidatorPipe(createInvitationSchema))
    data: CreateInvitationDto,

    // @CurrentUser() currentUser: AuthUser,
  ) {
    console.log(data)
    return this.invitationService.create({
      tenantId,
      email: data.email,
      roleId: data.roleId,
      invitedByUserId: 'fa0d861c-20d2-4fdf-b317-6418efef06a3',
    });
  }
}
