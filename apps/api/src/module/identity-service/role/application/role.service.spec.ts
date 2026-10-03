import { describe, expect, it, jest } from '@jest/globals';
import { RoleService } from './role.service';

describe('RoleService', () => {
  it('creates a tenant-scoped role with permissions', async () => {
    const repository = {
      findTenant: jest.fn().mockResolvedValue({ id: 'tenant-1' }),
      findByTenantAndName: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 'role-1',
        tenantId: 'tenant-1',
        name: 'Teacher',
        description: 'Handles teaching tasks',
      }),
      setPermissions: jest.fn().mockResolvedValue({
        id: 'role-1',
        tenantId: 'tenant-1',
        name: 'Teacher',
        description: 'Handles teaching tasks',
        rolePermissions: [{ permission: { code: 'tenant.read' } }],
      }),
      findById: jest.fn().mockResolvedValue({
        id: 'role-1',
        tenantId: 'tenant-1',
        name: 'Teacher',
        description: 'Handles teaching tasks',
      }),
    };

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
    expect(result.name).toBe('Teacher');
  });
});
