import { BadRequestException, Injectable } from '@nestjs/common';
import { TenantSettingsPrismaRepository } from '../infrastructure/tenant-settings-prisma.repository';

export type TenantSettingsInput = {
  locale?: string;
  timezone?: string;
  currency?: string;
  dateFormat?: string;
};

const DEFAULT_TENANT_SETTINGS = {
  locale: 'en',
  timezone: 'UTC',
  currency: 'USD',
  dateFormat: 'YYYY-MM-DD',
};

@Injectable()
export class TenantSettingsService {
  constructor(
    private readonly tenantSettingsRepository: TenantSettingsPrismaRepository,
  ) {}

  async getOrCreate(tenantId: string) {
    const existing =
      await this.tenantSettingsRepository.findByTenantId(tenantId);

    if (existing) {
      return existing;
    }

    return this.tenantSettingsRepository.upsert(
      tenantId,
      DEFAULT_TENANT_SETTINGS,
    );
  }

  async update(tenantId: string, data: TenantSettingsInput) {
    const current = await this.getOrCreate(tenantId);

    const { tenantId: _tenantId, ...currentSettings } = current ?? {};

    const nextSettings = {
      ...DEFAULT_TENANT_SETTINGS,
      ...currentSettings,
      ...data,
    };

    if (
      !nextSettings.locale ||
      !nextSettings.timezone ||
      !nextSettings.currency
    ) {
      throw new BadRequestException('Tenant settings are invalid');
    }

    return this.tenantSettingsRepository.upsert(tenantId, nextSettings);
  }
}
