import { describe, expect, it, jest } from '@jest/globals';
import { MembershipService } from './membership.service';

describe('MembershipService', () => {
  it('assigns the user to requested roles in a tenant', async () => {
    const repository = {
      findTenant: jest.fn().mockResolvedValue({ id: 'tenant-1' }),
      findByUserId: jest.fn().mockResolvedValue({
        id: 'membership-1',
        tenantId: 'tenant-1',
        userId: 'user-1',
      }),
      createMembership: jest.fn().mockResolvedValue({
        id: 'membership-1',
        tenantId: 'tenant-1',
        userId: 'user-1',
      }),
      findRolesByIds: jest.fn().mockResolvedValue([
        { id: 'role-1', tenantId: 'tenant-1', name: 'Teacher' },
        { id: 'role-2', tenantId: 'tenant-1', name: 'Admin' },
      ]),
      setUserRoles: jest.fn().mockResolvedValue([
        { roleId: 'role-1', role: { name: 'Teacher' } },
        { roleId: 'role-2', role: { name: 'Admin' } },
      ]),
    };

    const service = new MembershipService(repository as any);
    const result = await service.setUserRoles('tenant-1', 'user-1', [
      'role-1',
      'role-2',
    ]);

    expect(repository.findTenant).toHaveBeenCalledWith('tenant-1');
    expect(repository.setUserRoles).toHaveBeenCalledWith('membership-1', [
      'role-1',
      'role-2',
    ]);
    expect(result).toHaveLength(2);
  });
});
