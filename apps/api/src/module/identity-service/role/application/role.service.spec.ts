import { describe, expect, it, jest } from '@jest/globals';
import { RoleService } from './role.service';

const makeMock = <T extends (...args: any[]) => any>() =>
  jest.fn() as unknown as jest.MockedFunction<T>;

describe('RoleService', () => {
  it('creates a tenant-scoped role with permissions', async () => {
    const repository = {
      findTenant: makeMock<(tenantId: string) => Promise<any>>(),
      findByTenantAndName:
        makeMock<(tenantId: string, name: string) => Promise<any | null>>(),
      create: makeMock<(payload: any) => Promise<any>>(),
      setPermissions:
        makeMock<(roleId: string, permissionCodes: string[]) => Promise<any>>(),
      findById: makeMock<(id: string) => Promise<any>>(),
    };

    repository.findTenant.mockResolvedValue({ id: 'tenant-1' });
    repository.findByTenantAndName.mockResolvedValue(null);
    repository.create.mockResolvedValue({
      id: 'role-1',
      tenantId: 'tenant-1',
      name: 'Teacher',
      description: 'Handles teaching tasks',
    });
    repository.setPermissions.mockResolvedValue({
      id: 'role-1',
      tenantId: 'tenant-1',
      name: 'Teacher',
      description: 'Handles teaching tasks',
      rolePermissions: [{ permission: { code: 'tenant.read' } }],
    });
    repository.findById.mockResolvedValue({
      id: 'role-1',
      tenantId: 'tenant-1',
      name: 'Teacher',
      description: 'Handles teaching tasks',
    });

    const service = new RoleService(repository as any);
    const result = await service.create('tenant-1', {
      name: 'Teacher',
      description: 'Handles teaching tasks',
      permissionCodes: ['tenant.read'],
    });

    expect(repository.findTenant).toHaveBeenCalledWith('tenant-1');
    expect(repository.create).toHaveBeenCalledWith({
      tenantId: 'tenant-1',
      name: 'Teacher',
      description: 'Handles teaching tasks',
    });
    expect(result?.name).toBe('Teacher');
  });
});
