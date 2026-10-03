import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MembershipRepository } from '../infrastructure/membership.repository';

@Injectable()
export class MembershipService {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async list(tenantId: string) {
    return this.membershipRepository.list(tenantId);
  }

  async getByUserId(tenantId: string, userId: string) {
    const membership = await this.membershipRepository.findByUserId(
      tenantId,
      userId,
    );

    if (!membership) {
      throw new NotFoundException('Tenant membership not found');
    }

    return membership;
  }

  async getUserRoles(tenantId: string, userId: string) {
    await this.getByUserId(tenantId, userId);
    return this.membershipRepository.listUserRoles(tenantId, userId);
  }

  async setUserRoles(tenantId: string, userId: string, roleIds: string[]) {
    const tenant = await this.membershipRepository.findTenant(tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const normalizedRoleIds = [...new Set(roleIds.filter(Boolean))];

    if (normalizedRoleIds.length === 0) {
      throw new BadRequestException('At least one role is required');
    }

    const membership = await this.membershipRepository.findByUserId(
      tenantId,
      userId,
    );
    const tenantUserId =
      membership?.id ??
      (await this.membershipRepository.createMembership({ tenantId, userId }))
        .id;

    const roles = await this.membershipRepository.findRolesByIds(
      tenantId,
      normalizedRoleIds,
    );

    if (roles.length !== normalizedRoleIds.length) {
      const foundIds = new Set(roles.map((role) => role.id));
      const missing = normalizedRoleIds.filter(
        (roleId) => !foundIds.has(roleId),
      );
      throw new BadRequestException(`Invalid role ids: ${missing.join(', ')}`);
    }

    return this.membershipRepository.setUserRoles(
      tenantUserId,
      normalizedRoleIds,
    );
  }
}
