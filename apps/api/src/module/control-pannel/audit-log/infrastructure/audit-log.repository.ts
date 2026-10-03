import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';

@Injectable()
export class AuditLogRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async listByTenant(tenantId: string): Promise<any[]> {
    return this.prismaService.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        actor: true,
      },
    });
  }

  async getById(tenantId: string, logId: string): Promise<any> {
    return this.prismaService.auditLog.findFirst({
      where: {
        id: logId,
        tenantId,
      },
      include: {
        actor: true,
      },
    });
  }
}
