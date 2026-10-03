import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ZodValidatorPipe } from 'src/common/pipline/zod-validator.pipline';
import { TenantDomainService } from '../application/tenant-domain.service';
import { CreateDomainDto, CreateDomainSchema } from './dto/create-domain.dto';
import { UpdateDomainDto, UpdateDomainSchema } from './dto/update-domain.dto';

@Controller('tenants/:tenantId/domains')
export class TenantDomainController {
  constructor(private readonly tenantDomainService: TenantDomainService) {}

  @Get()
  async list(@Param('tenantId') tenantId: string) {
    return this.tenantDomainService.list(tenantId);
  }

  @Post()
  async create(
    @Param('tenantId') tenantId: string,
    @Body(new ZodValidatorPipe(CreateDomainSchema))
    domainData: CreateDomainDto,
  ) {
    return this.tenantDomainService.create(tenantId, domainData);
  }

  @Get(':domainId')
  async getById(
    @Param('tenantId') tenantId: string,
    @Param('domainId') domainId: string,
  ) {
    return this.tenantDomainService.getById(tenantId, domainId);
  }

  @Patch(':domainId')
  async update(
    @Param('tenantId') tenantId: string,
    @Param('domainId') domainId: string,
    @Body(new ZodValidatorPipe(UpdateDomainSchema))
    domainData: UpdateDomainDto,
  ) {
    return this.tenantDomainService.update(tenantId, domainId, domainData);
  }

  @Delete(':domainId')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('tenantId') tenantId: string,
    @Param('domainId') domainId: string,
  ) {
    return this.tenantDomainService.remove(tenantId, domainId);
  }

  @Post(':domainId/verify')
  async verify(
    @Param('tenantId') tenantId: string,
    @Param('domainId') domainId: string,
  ) {
    return this.tenantDomainService.verify(tenantId, domainId);
  }

  @Post(':domainId/set-primary')
  async setPrimary(
    @Param('tenantId') tenantId: string,
    @Param('domainId') domainId: string,
  ) {
    return this.tenantDomainService.setPrimary(tenantId, domainId);
  }
}
