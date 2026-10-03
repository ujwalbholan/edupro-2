import { Injectable, NotFoundException } from '@nestjs/common';
import { FeatureService } from '../../feature/application/feature.service';
import { PlanService } from '../../subscription/application/plan.service';
import { TenantService } from '../../tenant/application/tenant.service';
import { UpdateTenantDto } from '../../tenant/presentation/dto/update-tenant.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly planService: PlanService,
    private readonly featureService: FeatureService,
  ) {}

  async listTenants() {
    return this.tenantService.get();
  }

  async getTenantById(tenantId: string) {
    const tenant = await this.tenantService.findByID(tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async updateTenant(tenantId: string, data: UpdateTenantDto) {
    const tenant = await this.tenantService.findByID(tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.tenantService.updateTenant(tenantId, data);
  }

  async listPlans() {
    return this.planService.list();
  }

  async listFeatures() {
    return this.featureService.list();
  }
}
