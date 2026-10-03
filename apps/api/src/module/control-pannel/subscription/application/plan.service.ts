import { Injectable, NotFoundException } from '@nestjs/common';
import { PlanRepository } from '../infrastructure/plan.repository';

@Injectable()
export class PlanService {
  constructor(private readonly planRepository: PlanRepository) {}

  async list() {
    return this.planRepository.list();
  }

  async getById(planId: string) {
    const plan = await this.planRepository.getById(planId);

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }
}
