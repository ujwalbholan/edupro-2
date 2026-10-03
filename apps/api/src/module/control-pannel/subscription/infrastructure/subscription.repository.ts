import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findTenant(tenantId: string) {
    return this.prismaService.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true },
    });
  }

  async findPlan(planId: string) {
    return this.prismaService.subscriptionPlan.findUnique({
      where: { id: planId },
      select: { id: true, name: true },
    });
  }

  async getCurrent(tenantId: string) {
    return this.prismaService.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        plan: true,
      },
    });
  }

  async assignPlan(tenantId: string, planId: string) {
    const current = await this.getCurrent(tenantId);

    const startsAt = new Date();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (current) {
      return this.prismaService.subscription.update({
        where: { id: current.id },
        data: {
          planId,
          status: 'ACTIVE',
          startsAt,
          expiresAt,
        },
        include: { plan: true },
      });
    }

    return this.prismaService.subscription.create({
      data: {
        tenantId,
        planId,
        status: 'ACTIVE',
        startsAt,
        expiresAt,
      },
      include: { plan: true },
    });
  }
}
