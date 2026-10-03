import { describe, expect, it, jest } from '@jest/globals';
import { PlanService } from './plan.service';

const mockFn = <T extends (...args: any[]) => any>() =>
  jest.fn() as unknown as jest.MockedFunction<T>;

describe('PlanService', () => {
  it('lists plans with features', async () => {
    const repository = {
      list: mockFn<() => Promise<any[]>>(),
      getById: mockFn<(id: string) => Promise<any>>(),
    };

    repository.list.mockResolvedValue([
      {
        id: 'plan-1',
        name: 'Pro',
        price: 9900,
        currency: 'USD',
        features: [{ feature: { key: 'billing', name: 'Billing' } }],
      },
    ]);
    repository.getById.mockResolvedValue({
      id: 'plan-1',
      name: 'Pro',
      price: 9900,
      currency: 'USD',
    });

    const service = new PlanService(repository as any);
    const plans = await service.list();

    expect(repository.list).toHaveBeenCalled();
    expect(plans?.[0]?.name).toBe('Pro');
  });
});
