import { describe, expect, it, jest } from '@jest/globals';
import { AdminService } from './admin.service';

const mockFn = <T extends (...args: any[]) => any>() =>
  jest.fn() as unknown as jest.MockedFunction<T>;

describe('AdminService', () => {
  it('lists tenants and platform catalog data for admin views', async () => {
    const tenantService = {
      get: mockFn<() => Promise<any[]>>(),
      findByID: mockFn<() => Promise<any>>(),
      updateTenant: mockFn<() => Promise<any>>(),
    };
    const planService = {
      list: mockFn<() => Promise<any[]>>(),
    };
    const featureService = {
      list: mockFn<() => Promise<any[]>>(),
    };

    tenantService.get.mockResolvedValue([{ id: 'tenant-1', name: 'Acme' }]);
    tenantService.findByID.mockResolvedValue({ id: 'tenant-1', name: 'Acme' });
    tenantService.updateTenant.mockResolvedValue({
      id: 'tenant-1',
      name: 'Updated',
    });
    planService.list.mockResolvedValue([{ id: 'plan-1', name: 'Pro' }]);
    featureService.list.mockResolvedValue([
      { id: 'feature-1', key: 'billing', name: 'Billing' },
    ]);

    const service = new AdminService(
      tenantService as any,
      planService as any,
      featureService as any,
    );

    const tenants = await service.listTenants();
    const plans = await service.listPlans();
    const features = await service.listFeatures();

    expect(tenantService.get).toHaveBeenCalled();
    expect(plans?.[0]?.name).toBe('Pro');
    expect(features?.[0]?.key).toBe('billing');
    expect(tenants?.[0]?.name).toBe('Acme');
  });
});
