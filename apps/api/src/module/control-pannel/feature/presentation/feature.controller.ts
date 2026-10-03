import { Controller, Get, Param } from '@nestjs/common';
import { FeatureService } from '../application/feature.service';

@Controller()
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get('features')
  async list() {
    return this.featureService.list();
  }

  @Get('features/:featureId')
  async getById(@Param('featureId') featureId: string) {
    return this.featureService.getById(featureId);
  }

  @Get('plans/:planId/features')
  async listPlanFeatures(@Param('planId') planId: string) {
    return this.featureService.listForPlan(planId);
  }
}
