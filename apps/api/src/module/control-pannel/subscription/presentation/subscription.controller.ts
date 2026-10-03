import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlanService } from '../application/plan.service';
import { SubscriptionService } from '../application/subscription.service';

@Controller('billing')
export class SubscriptionController {
  constructor(
    private readonly planService: PlanService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Get('plans')
  async listPlans() {
    return this.planService.list();
  }

  @Get('plans/:planId')
  async getPlan(@Param('planId') planId: string) {
    return this.planService.getById(planId);
  }

  @Get('tenants/:tenantId/subscriptions/current')
  async getCurrentSubscription(@Param('tenantId') tenantId: string) {
    return this.subscriptionService.getCurrent(tenantId);
  }

  @Post('tenants/:tenantId/subscriptions/assign')
  async assignPlan(
    @Param('tenantId') tenantId: string,
    @Body() body: { planId: string },
  ) {
    return this.subscriptionService.assignPlan(tenantId, body.planId);
  }
}
