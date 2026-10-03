import { describe, expect, it, jest } from '@jest/globals';
import {
  DomainType,
  DomainVerificationStatus,
} from '@repo/database-config/dist/generated/prisma/enums';
import { TenantDomainService } from './tenant-domain.service';

const makeMock = <T extends (...args: any[]) => any>(impl?: T) =>
  jest.fn(impl) as unknown as jest.MockedFunction<T>;

describe('TenantDomainService', () => {
  it('creates a tenant domain using normalized values and pending verification', async () => {
    const repository = {
      findByTenant: makeMock<() => Promise<any[]>>(),
      findById: makeMock<(id: string) => Promise<any>>(),
      findByTenantAndId:
        makeMock<(tenantId: string, id: string) => Promise<any>>(),
      findByDomain: makeMock<(domain: string) => Promise<any | null>>(),
      create: makeMock<(payload: any) => Promise<any>>(),
      update:
        makeMock<
          (tenantId: string, id: string, payload: any) => Promise<any>
        >(),
      remove: makeMock<(tenantId: string, id: string) => Promise<any>>(),
      setPrimary: makeMock<(tenantId: string, id: string) => Promise<any>>(),
      verify: makeMock<(tenantId: string, id: string) => Promise<any>>(),
    };

    repository.findByTenant.mockResolvedValue([]);
    repository.findByDomain.mockResolvedValue(null);
    repository.create.mockResolvedValue({
      id: 'domain-1',
      tenantId: 'tenant-1',
      domain: 'example.com',
      type: DomainType.CUSTOM,
      isPrimary: false,
      verificationStatus: DomainVerificationStatus.PENDING,
    });

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
      findByTenant: makeMock<() => Promise<any[]>>(),
      findById: makeMock<(id: string) => Promise<any>>(),
      findByTenantAndId:
        makeMock<(tenantId: string, id: string) => Promise<any>>(),
      findByDomain: makeMock<(domain: string) => Promise<any | null>>(),
      create: makeMock<(payload: any) => Promise<any>>(),
      update:
        makeMock<
          (tenantId: string, id: string, payload: any) => Promise<any>
        >(),
      remove: makeMock<(tenantId: string, id: string) => Promise<any>>(),
      setPrimary: makeMock<(tenantId: string, id: string) => Promise<any>>(),
      verify: makeMock<(tenantId: string, id: string) => Promise<any>>(),
    };

    repository.findByTenant.mockResolvedValue([{}]);
    repository.findById.mockResolvedValue({
      id: 'domain-2',
      tenantId: 'tenant-1',
    });
    repository.findByTenantAndId.mockResolvedValue({
      id: 'domain-2',
      tenantId: 'tenant-1',
    });
    repository.setPrimary.mockResolvedValue({
      id: 'domain-2',
      isPrimary: true,
    });

    const service = new TenantDomainService(repository as any);

    const result = await service.setPrimary('tenant-1', 'domain-2');

    expect(repository.setPrimary).toHaveBeenCalledWith('tenant-1', 'domain-2');
    expect(result).toEqual({ id: 'domain-2', isPrimary: true });
  });
});
