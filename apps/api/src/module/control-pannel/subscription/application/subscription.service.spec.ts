import { describe, expect, it, jest } from '@jest/globals';
import { SubscriptionService } from './subscription.service';

const mockFn = <T extends (...args: any[]) => any>() =>
  jest.fn() as unknown as jest.MockedFunction<T>;

describe('SubscriptionService', () => {
  it('returns the current tenant subscription and plan', async () => {
    const repository = {
      getCurrent: mockFn<(tenantId: string) => Promise<any>>(),
      assignPlan: mockFn<(tenantId: string, planId: string) => Promise<any>>(),
    };

    repository.getCurrent.mockResolvedValue({
      id: 'sub-1',
      tenantId: 'tenant-1',
      status: 'ACTIVE',
      plan: { id: 'plan-1', name: 'Pro' },
    });
    repository.assignPlan.mockResolvedValue({
      id: 'sub-1',
      tenantId: 'tenant-1',
      status: 'ACTIVE',
    });

    const service = new SubscriptionService(repository as any);
    const result = await service.getCurrent('tenant-1');

    expect(repository.getCurrent).toHaveBeenCalledWith('tenant-1');
    expect(result?.plan?.name).toBe('Pro');
  });
});
