import { BadRequestException, Injectable } from '@nestjs/common';
import { TenantThemePrismaRepository } from '../infrastructure/tenant-theme-prisma.repository';

export type TenantThemeInput = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  fontFamily?: string;
};

const DEFAULT_TENANT_THEME = {
  primaryColor: '#2563EB',
  secondaryColor: '#0F172A',
  accentColor: '#F59E0B',
  fontFamily: 'Inter',
};

@Injectable()
export class TenantThemeService {
  constructor(
    private readonly tenantThemeRepository: TenantThemePrismaRepository,
  ) {}

  async getOrCreate(tenantId: string) {
    const existing = await this.tenantThemeRepository.findByTenantId(tenantId);

    if (existing) {
      return existing;
    }

    return this.tenantThemeRepository.upsert(tenantId, DEFAULT_TENANT_THEME);
  }

  async update(tenantId: string, data: TenantThemeInput) {
    const current = await this.getOrCreate(tenantId);

    const { tenantId: _tenantId, ...currentTheme } = current ?? {};

    const nextTheme = {
      ...DEFAULT_TENANT_THEME,
      ...currentTheme,
      ...data,
    };

    if (
      !nextTheme.primaryColor ||
      !nextTheme.secondaryColor ||
      !nextTheme.accentColor ||
      !nextTheme.fontFamily
    ) {
      throw new BadRequestException('Tenant theme is invalid');
    }

    return this.tenantThemeRepository.upsert(tenantId, nextTheme);
  }
}
