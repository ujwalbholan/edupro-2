import { describe, expect, it, jest } from '@jest/globals';
import {
  DomainType,
  DomainVerificationStatus,
} from '@repo/database-config/dist/generated/prisma/enums';
import { TenantDomainService } from './tenant-domain.service';

describe('TenantDomainService', () => {
  it('creates a tenant domain using normalized values and pending verification', async () => {
    const repository = {
      findByTenant: jest.fn().mockResolvedValue([]),
      findById: jest.fn(),
      findByTenantAndId: jest.fn(),
      findByDomain: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 'domain-1',
        tenantId: 'tenant-1',
        domain: 'example.com',
        type: DomainType.CUSTOM,
        isPrimary: false,
        verificationStatus: DomainVerificationStatus.PENDING,
      }),
      update: jest.fn(),
      remove: jest.fn(),
      setPrimary: jest.fn(),
      verify: jest.fn(),
    };

    const service = new TenantDomainService(repository as any);

    await service.create('tenant-1', {
      domain: ' Example.com ',
      type: DomainType.CUSTOM,
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: 'tenant-1',
        domain: 'example.com',
        type: DomainType.CUSTOM,
        verificationStatus: DomainVerificationStatus.PENDING,
        isPrimary: false,
      }),
    );
  });

  it('marks the selected domain as primary and clears others for the tenant', async () => {
    const repository = {
      findByTenant: jest.fn().mockResolvedValue([{}]),
      findById: jest
        .fn()
        .mockResolvedValue({ id: 'domain-2', tenantId: 'tenant-1' }),
      findByTenantAndId: jest
        .fn()
        .mockResolvedValue({ id: 'domain-2', tenantId: 'tenant-1' }),
      findByDomain: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      setPrimary: jest
        .fn()
        .mockResolvedValue({ id: 'domain-2', isPrimary: true }),
      verify: jest.fn(),
    };

    const service = new TenantDomainService(repository as any);

    const result = await service.setPrimary('tenant-1', 'domain-2');

    expect(repository.setPrimary).toHaveBeenCalledWith('tenant-1', 'domain-2');
    expect(result).toEqual({ id: 'domain-2', isPrimary: true });
  });
});
