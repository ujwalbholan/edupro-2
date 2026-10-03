import { describe, expect, it, jest } from '@jest/globals';
import { AuditLogService } from './audit-log.service';

const mockFn = <T extends (...args: any[]) => any>() =>
  jest.fn() as unknown as jest.MockedFunction<T>;

describe('AuditLogService', () => {
  it('lists tenant audit logs in newest-first order', async () => {
    const repository = {
      listByTenant: mockFn<(tenantId: string) => Promise<any[]>>(),
      getById: mockFn<(id: string) => Promise<any>>(),
    };

    repository.listByTenant.mockResolvedValue([
      {
        id: 'log-1',
        tenantId: 'tenant-1',
        action: 'tenant.created',
        resource: 'tenant',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    ]);
    repository.getById.mockResolvedValue({
      id: 'log-1',
      tenantId: 'tenant-1',
      action: 'tenant.created',
      resource: 'tenant',
    });

    const service = new AuditLogService(repository as any);
    const result = await service.list('tenant-1');

    expect(repository.listByTenant).toHaveBeenCalledWith('tenant-1');
    expect(result?.[0]?.action).toBe('tenant.created');
  });
});
