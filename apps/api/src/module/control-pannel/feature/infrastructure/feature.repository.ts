import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';

@Injectable()
export class FeatureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list() {
    return this.prismaService.feature.findMany({
      include: {
        plans: {
          include: { plan: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async listByPlan(planId: string) {
    return this.prismaService.planFeature.findMany({
      where: { planId },
      include: {
        feature: true,
      },
      orderBy: {
        feature: {
          name: 'asc',
        },
      },
    });
  }

  async getById(featureId: string) {
    return this.prismaService.feature.findUnique({
      where: { id: featureId },
      include: {
        plans: {
          include: { plan: true },
        },
      },
    });
  }
}
