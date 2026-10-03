import { Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionRepository } from '../infrastructure/subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async getCurrent(tenantId: string) {
    const subscription = await this.subscriptionRepository.getCurrent(tenantId);

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async assignPlan(tenantId: string, planId: string) {
    const tenant = await this.subscriptionRepository.findTenant(tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const plan = await this.subscriptionRepository.findPlan(planId);

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return this.subscriptionRepository.assignPlan(tenantId, planId);
  }
}
