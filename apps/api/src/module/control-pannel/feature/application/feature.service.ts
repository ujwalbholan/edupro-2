import { Injectable, NotFoundException } from '@nestjs/common';
import { FeatureRepository } from '../infrastructure/feature.repository';

@Injectable()
export class FeatureService {
  constructor(private readonly featureRepository: FeatureRepository) {}

  async list() {
    return this.featureRepository.list();
  }

  async listForPlan(planId: string) {
    return this.featureRepository.listByPlan(planId);
  }

  async getById(featureId: string) {
    const feature = await this.featureRepository.getById(featureId);

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    return feature;
  }
}
