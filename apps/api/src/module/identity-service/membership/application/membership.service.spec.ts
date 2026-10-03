import { describe, expect, it, jest } from '@jest/globals';
import { MembershipService } from './membership.service';

const makeMock = <T extends (...args: any[]) => any>() =>
  jest.fn() as unknown as jest.MockedFunction<T>;

describe('MembershipService', () => {
  it('assigns the user to requested roles in a tenant', async () => {
    const repository = {
      findTenant: makeMock<(tenantId: string) => Promise<any>>(),
      findByUserId: makeMock<(userId: string) => Promise<any>>(),
      createMembership:
        makeMock<(tenantId: string, userId: string) => Promise<any>>(),
      findRolesByIds: makeMock<(roleIds: string[]) => Promise<any[]>>(),
      setUserRoles:
        makeMock<(membershipId: string, roleIds: string[]) => Promise<any[]>>(),
    };

    repository.findTenant.mockResolvedValue({ id: 'tenant-1' });
    repository.findByUserId.mockResolvedValue({
      id: 'membership-1',
      tenantId: 'tenant-1',
      userId: 'user-1',
    });
    repository.createMembership.mockResolvedValue({
      id: 'membership-1',
      tenantId: 'tenant-1',
      userId: 'user-1',
    });
    repository.findRolesByIds.mockResolvedValue([
      { id: 'role-1', tenantId: 'tenant-1', name: 'Teacher' },
      { id: 'role-2', tenantId: 'tenant-1', name: 'Admin' },
    ]);
    repository.setUserRoles.mockResolvedValue([
      { roleId: 'role-1', role: { name: 'Teacher' } },
      { roleId: 'role-2', role: { name: 'Admin' } },
    ]);

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
