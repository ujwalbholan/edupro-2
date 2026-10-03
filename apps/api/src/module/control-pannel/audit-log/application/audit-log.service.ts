import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditLogRepository } from '../infrastructure/audit-log.repository';

@Injectable()
export class AuditLogService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async list(tenantId: string): Promise<any[]> {
    return this.auditLogRepository.listByTenant(tenantId);
  }

  async getById(tenantId: string, logId: string): Promise<any> {
    const log = await this.auditLogRepository.getById(tenantId, logId);

    if (!log) {
      throw new NotFoundException('Audit log not found');
    }

    return log;
  }
}
