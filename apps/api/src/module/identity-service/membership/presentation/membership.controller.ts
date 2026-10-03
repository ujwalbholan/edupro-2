import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ZodValidatorPipe } from 'src/common/pipline/zod-validator.pipline';
import { MembershipService } from '../application/membership.service';
import { SetUserRolesDto, SetUserRolesSchema } from './dto/set-user-roles.dto';

@Controller('tenants/:tenantId/users')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  async list(@Param('tenantId') tenantId: string) {
    return this.membershipService.list(tenantId);
  }

  @Get(':userId')
  async getByUserId(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string,
  ) {
    return this.membershipService.getByUserId(tenantId, userId);
  }

  @Get(':userId/roles')
  async getUserRoles(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string,
  ) {
    return this.membershipService.getUserRoles(tenantId, userId);
  }

  @Put(':userId/roles')
  async setUserRoles(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string,
    @Body(new ZodValidatorPipe(SetUserRolesSchema))
    data: SetUserRolesDto,
  ) {
    return this.membershipService.setUserRoles(tenantId, userId, data.roleIds);
  }
}
