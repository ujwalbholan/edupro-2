import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  live() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async ready() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      database: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
