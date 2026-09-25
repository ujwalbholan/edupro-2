import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidatorPipe } from 'src/common/pipline/zod-validator.pipline';
import {
  CreateInvitationDto,
  createInvitationSchema,
} from './DTO/create-invitation.dto';
import { InvitationService } from '../application/invitation.service';

@Controller()
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post('/invitation')
  async createInvitation(
    @Body(new ZodValidatorPipe(createInvitationSchema))
    invitationData: CreateInvitationDto,
  ) {
    return this.invitationService.create(invitationData);
  }
}
