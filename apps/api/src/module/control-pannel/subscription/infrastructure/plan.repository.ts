import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';

@Injectable()
export class PlanRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list() {
    return this.prismaService.subscriptionPlan.findMany({
      include: {
        features: {
          include: { feature: true },
        },
      },
      orderBy: { price: 'asc' },
    });
  }

  async getById(planId: string) {
    return this.prismaService.subscriptionPlan.findUnique({
      where: { id: planId },
      include: {
        features: {
          include: { feature: true },
        },
      },
    });
  }
}
