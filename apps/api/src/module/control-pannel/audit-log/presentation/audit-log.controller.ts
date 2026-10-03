import { Controller, Get, Param } from '@nestjs/common';
import { AuditLogService } from '../application/audit-log.service';

@Controller('tenants/:tenantId/audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async list(@Param('tenantId') tenantId: string): Promise<any[]> {
    return this.auditLogService.list(tenantId);
  }

  @Get(':logId')
  async getById(
    @Param('tenantId') tenantId: string,
    @Param('logId') logId: string,
  ): Promise<any> {
    return this.auditLogService.getById(tenantId, logId);
  }
}
