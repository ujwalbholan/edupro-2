import { Injectable } from '@nestjs/common';
import { TenantUserRepository } from '../infrastructure/tenant-user.repository';

@Injectable()
export class TenantUserService {
  constructor(private readonly tenantUserRepository: TenantUserRepository) {}

  async getTenantAllUser(tenantId: string) {
    return this.tenantUserRepository.getTenantAllUser(tenantId);
  }

  async getTenantUser(tenantId: string, userId: string) {
    return this.tenantUserRepository.getTenantUser(tenantId, userId);
  }
}
