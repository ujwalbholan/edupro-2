import { describe, it, expect, jest } from '@jest/globals';
import {
  InstitutionType,
  TenantStatus,
} from '@repo/database-config/dist/generated/prisma/enums';
import { TenantService } from './tenant.service';

const makeMock = <T extends (...args: any[]) => any>() =>
  jest.fn() as unknown as jest.MockedFunction<T>;

describe('TenantService', () => {
  it('creates tenant defaults and forces pending setup status', async () => {
    const repository = {
      create: makeMock<(payload: any) => Promise<any>>(),
      findBySlug: makeMock<(slug: string) => Promise<any | null>>(),
      get: makeMock<() => Promise<any[]>>(),
      findById: makeMock<(id: string) => Promise<any>>(),
      updateTenant:
        makeMock<(tenantId: string, payload: any) => Promise<any>>(),
      removeTenant: makeMock<(tenantId: string) => Promise<any>>(),
    };

    repository.create.mockResolvedValue({ id: 'tenant-1' });
    repository.findBySlug
      .mockResolvedValueOnce({ id: 'existing-tenant' })
      .mockResolvedValueOnce(null);

    const service = new TenantService(repository as any);

    await service.create({
      name: 'Test Campus',
      institutionType: InstitutionType.SCHOOL,
      status: TenantStatus.ACTIVE,
      slug: 'ignored',
    });

    expect(repository.findBySlug).toHaveBeenNthCalledWith(1, 'test-campus');
    expect(repository.findBySlug).toHaveBeenNthCalledWith(2, 'test-campus-2');
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Campus',
        slug: 'test-campus-2',
        status: TenantStatus.PENDING_SETUP,
        institutionType: InstitutionType.SCHOOL,
        settings: {
          create: expect.objectContaining({
            locale: 'en',
            timezone: 'UTC',
            currency: 'USD',
            dateFormat: 'YYYY-MM-DD',
          }),
        },
        theme: {
          create: expect.objectContaining({
            primaryColor: '#2563EB',
            secondaryColor: '#0F172A',
            accentColor: '#F59E0B',
            fontFamily: 'Inter',
          }),
        },
      }),
    );
  });
});
