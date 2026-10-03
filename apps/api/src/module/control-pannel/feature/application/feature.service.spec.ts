import { describe, expect, it, jest } from '@jest/globals';
import { FeatureService } from './feature.service';

const mockFn = <T extends (...args: any[]) => any>() =>
  jest.fn() as unknown as jest.MockedFunction<T>;

describe('FeatureService', () => {
  it('lists features and exposes enablement metadata', async () => {
    const repository = {
      list: mockFn<() => Promise<any[]>>(),
      getById: mockFn<(id: string) => Promise<any>>(),
    };

    repository.list.mockResolvedValue([
      {
        id: 'feature-1',
        key: 'billing',
        name: 'Billing',
        description: 'Billing access',
        isActive: true,
        plans: [{ planId: 'plan-1', enabled: true }],
      },
    ]);
    repository.getById.mockResolvedValue({
      id: 'feature-1',
      key: 'billing',
      name: 'Billing',
      description: 'Billing access',
      isActive: true,
    });

    const service = new FeatureService(repository as any);
    const features = await service.list();

    expect(repository.list).toHaveBeenCalled();
    expect(features?.[0]?.key).toBe('billing');
  });
});
