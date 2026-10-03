import { Module } from '@nestjs/common';
import { PlanService } from './application/plan.service';
import { SubscriptionService } from './application/subscription.service';
import { PlanRepository } from './infrastructure/plan.repository';
import { SubscriptionRepository } from './infrastructure/subscription.repository';
import { SubscriptionController } from './presentation/subscription.controller';

@Module({
  controllers: [SubscriptionController],
  providers: [
    PlanService,
    PlanRepository,
    SubscriptionService,
    SubscriptionRepository,
  ],
  exports: [
    PlanService,
    PlanRepository,
    SubscriptionService,
    SubscriptionRepository,
  ],
})
export class SubscriptionModule {}
