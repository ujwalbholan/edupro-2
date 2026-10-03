import { Module } from '@nestjs/common';
import { AuditLogService } from './application/audit-log.service';
import { AuditLogRepository } from './infrastructure/audit-log.repository';
import { AuditLogController } from './presentation/audit-log.controller';

@Module({
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogRepository],
  exports: [AuditLogService, AuditLogRepository],
})
export class AuditLogModule {}
