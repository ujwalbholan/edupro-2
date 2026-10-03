import { describe, expect, it, jest } from '@jest/globals';
import { TenantSettingsService } from './tenant-settings.service';
import { TenantThemeService } from './tenant-theme.service';

const makeMock = <T extends (...args: any[]) => any>() =>
  jest.fn() as unknown as jest.MockedFunction<T>;

describe('TenantSettingsService', () => {
  it('creates default settings for a tenant when none exist', async () => {
    const repository = {
      findByTenantId: makeMock<(tenantId: string) => Promise<any | null>>(),
      upsert: makeMock<(tenantId: string, payload: any) => Promise<any>>(),
    };

    repository.findByTenantId.mockResolvedValue(null);
    repository.upsert.mockResolvedValue({
      tenantId: 'tenant-1',
      locale: 'en',
      timezone: 'UTC',
      currency: 'USD',
      dateFormat: 'YYYY-MM-DD',
    });

    const service = new TenantSettingsService(repository as any);

    const result = await service.getOrCreate('tenant-1');

    expect(repository.upsert).toHaveBeenCalledWith('tenant-1', {
      locale: 'en',
      timezone: 'UTC',
      currency: 'USD',
      dateFormat: 'YYYY-MM-DD',
    });
    expect(result).toEqual({
      tenantId: 'tenant-1',
      locale: 'en',
      timezone: 'UTC',
      currency: 'USD',
      dateFormat: 'YYYY-MM-DD',
    });
  });

  it('updates settings without losing default values', async () => {
    const repository = {
      findByTenantId: makeMock<(tenantId: string) => Promise<any | null>>(),
      upsert: makeMock<(tenantId: string, payload: any) => Promise<any>>(),
    };

    repository.findByTenantId.mockResolvedValue({
      tenantId: 'tenant-1',
      locale: 'en',
      timezone: 'UTC',
      currency: 'USD',
      dateFormat: 'YYYY-MM-DD',
    });
    repository.upsert.mockResolvedValue({
      tenantId: 'tenant-1',
      locale: 'fr',
      timezone: 'Europe/Paris',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
    });

    const service = new TenantSettingsService(repository as any);

    const result = await service.update('tenant-1', {
      locale: 'fr',
      timezone: 'Europe/Paris',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
    });

    expect(repository.upsert).toHaveBeenCalledWith('tenant-1', {
      locale: 'fr',
      timezone: 'Europe/Paris',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
    });
    expect(result.locale).toBe('fr');
  });
});

describe('TenantThemeService', () => {
  it('creates default theme values for a tenant when missing', async () => {
    const repository = {
      findByTenantId: makeMock<(tenantId: string) => Promise<any | null>>(),
      upsert: makeMock<(tenantId: string, payload: any) => Promise<any>>(),
    };

    repository.findByTenantId.mockResolvedValue(null);
    repository.upsert.mockResolvedValue({
      tenantId: 'tenant-1',
      primaryColor: '#2563EB',
      secondaryColor: '#0F172A',
      accentColor: '#F59E0B',
      fontFamily: 'Inter',
    });

    const service = new TenantThemeService(repository as any);

    const result = await service.getOrCreate('tenant-1');

    expect(repository.upsert).toHaveBeenCalledWith('tenant-1', {
      primaryColor: '#2563EB',
      secondaryColor: '#0F172A',
      accentColor: '#F59E0B',
      fontFamily: 'Inter',
    });
    expect(result.primaryColor).toBe('#2563EB');
  });
});
