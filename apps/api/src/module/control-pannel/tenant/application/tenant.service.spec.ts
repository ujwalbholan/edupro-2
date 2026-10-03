import { describe, it, expect, jest } from '@jest/globals';
import {
  InstitutionType,
  TenantStatus,
} from '@repo/database-config/dist/generated/prisma/enums';
import { TenantService } from './tenant.service';

describe('TenantService', () => {
  it('creates tenant defaults and forces pending setup status', async () => {
    const repository = {
      create: jest.fn().mockResolvedValue({ id: 'tenant-1' }),
      findBySlug: jest
        .fn()
        .mockResolvedValueOnce({ id: 'existing-tenant' })
        .mockResolvedValueOnce(null),
      get: jest.fn(),
      findById: jest.fn(),
      updateTenant: jest.fn(),
      removeTenant: jest.fn(),
    };

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
