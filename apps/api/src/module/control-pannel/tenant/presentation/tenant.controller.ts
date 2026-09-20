import { Body, Controller, Post } from '@nestjs/common';
import { TenantService } from '../application/tenant.service';
import { CreateTenantDTO, CreateTenantSchema } from './dto/create-tenant.dto';
import { ZodValidatorPipe } from 'src/common/zod-validator.pipline';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('/create')
  async createTenant(
    @Body(new ZodValidatorPipe(CreateTenantSchema)) data: CreateTenantDTO,
  ) {
    const validateData = CreateTenantSchema.parse(data);
    await this.tenantService.create(validateData);
  }
}
