import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ZodValidatorPipe } from 'src/common/pipline/zod-validator.pipline';
import { RoleService } from '../application/role.service';
import { CreateRoleDto, CreateRoleSchema } from './dto/create-role.dto';
import {
  SetRolePermissionsDto,
  SetRolePermissionsSchema,
} from './dto/set-permissions.dto';
import { UpdateRoleDto, UpdateRoleSchema } from './dto/update-role.dto';

@Controller('tenants/:tenantId/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async list(@Param('tenantId') tenantId: string) {
    return this.roleService.list(tenantId);
  }

  @Post()
  async create(
    @Param('tenantId') tenantId: string,
    @Body(new ZodValidatorPipe(CreateRoleSchema))
    data: CreateRoleDto,
  ) {
    return this.roleService.create(tenantId, data);
  }

  @Get(':roleId')
  async getById(
    @Param('tenantId') tenantId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.roleService.getById(tenantId, roleId);
  }

  @Patch(':roleId')
  async update(
    @Param('tenantId') tenantId: string,
    @Param('roleId') roleId: string,
    @Body(new ZodValidatorPipe(UpdateRoleSchema))
    data: UpdateRoleDto,
  ) {
    return this.roleService.update(tenantId, roleId, data);
  }

  @Delete(':roleId')
  async remove(
    @Param('tenantId') tenantId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.roleService.remove(tenantId, roleId);
  }

  @Get(':roleId/permissions')
  async listPermissions(
    @Param('tenantId') tenantId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.roleService.listPermissions(tenantId, roleId);
  }

  @Put(':roleId/permissions')
  async setPermissions(
    @Param('tenantId') tenantId: string,
    @Param('roleId') roleId: string,
    @Body(new ZodValidatorPipe(SetRolePermissionsSchema))
    data: SetRolePermissionsDto,
  ) {
    return this.roleService.setPermissions(
      tenantId,
      roleId,
      data.permissionCodes,
    );
  }
}
