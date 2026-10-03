import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DomainType,
  DomainVerificationStatus,
} from '@repo/database-config/dist/generated/prisma/enums';
import { TenantDomainPrismaRepository } from '../infrastructure/tenant-domain-prisma.repository';

export type CreateTenantDomainInput = {
  domain: string;
  type?: DomainType;
  isPrimary?: boolean;
};

export type UpdateTenantDomainInput = {
  domain?: string;
  type?: DomainType;
  isPrimary?: boolean;
  sslStatus?: string | null;
  verificationStatus?: DomainVerificationStatus;
};

@Injectable()
export class TenantDomainService {
  constructor(
    private readonly tenantDomainRepository: TenantDomainPrismaRepository,
  ) {}

  async list(tenantId: string) {
    return this.tenantDomainRepository.findByTenant(tenantId);
  }

  async getById(tenantId: string, domainId: string) {
    const domain = await this.tenantDomainRepository.findByTenantAndId(
      tenantId,
      domainId,
    );

    if (!domain) {
      throw new NotFoundException('Domain not found for this tenant');
    }

    return domain;
  }

  async create(tenantId: string, input: CreateTenantDomainInput) {
    const domain = this.normalizeDomain(input.domain);

    if (!domain) {
      throw new BadRequestException('Domain is required');
    }

    const existing = await this.tenantDomainRepository.findByDomain(domain);

    if (existing && existing.tenantId !== tenantId) {
      throw new ConflictException('Domain already exists');
    }

    return this.tenantDomainRepository.create({
      tenantId,
      domain,
      type: input.type ?? DomainType.CUSTOM,
      isPrimary: input.isPrimary ?? false,
      verificationStatus: DomainVerificationStatus.PENDING,
    });
  }

  async update(
    tenantId: string,
    domainId: string,
    input: UpdateTenantDomainInput,
  ) {
    const existing = await this.getById(tenantId, domainId);

    const updateData: UpdateTenantDomainInput = { ...input };

    if (input.domain) {
      const normalized = this.normalizeDomain(input.domain);
      const conflict =
        await this.tenantDomainRepository.findByDomain(normalized);

      if (conflict && conflict.id !== existing.id) {
        throw new ConflictException('Domain already exists');
      }

      updateData.domain = normalized;
    }

    return this.tenantDomainRepository.update(domainId, updateData);
  }

  async remove(tenantId: string, domainId: string) {
    await this.getById(tenantId, domainId);

    await this.tenantDomainRepository.remove(domainId);

    return {
      message: 'Domain deleted successfully',
    };
  }

  async verify(tenantId: string, domainId: string) {
    const domain = await this.getById(tenantId, domainId);

    return this.tenantDomainRepository.verify(domain.id, {
      verificationStatus: DomainVerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      sslStatus: domain.sslStatus ?? 'verified',
    });
  }

  async setPrimary(tenantId: string, domainId: string) {
    const domain = await this.getById(tenantId, domainId);

    return this.tenantDomainRepository.setPrimary(tenantId, domain.id);
  }

  private normalizeDomain(value: string): string {
    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      return '';
    }

    if (!/^[a-z0-9.-]+$/.test(normalized)) {
      throw new BadRequestException('Domain contains invalid characters');
    }

    return normalized;
  }
}
