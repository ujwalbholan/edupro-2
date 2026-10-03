import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@repo/database-config';
import { TenantRepository } from '../domain/tenant.Irepository';
import { Tenant } from '@repo/database-config/dist/generated/prisma/client';
import { CreateTenantData } from '../types/CreateTenantTypes';
import { UpdateTenantDto } from '../presentation/dto/update-tenant.dto';

@Injectable()
export class TenantPrismaRepository implements TenantRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    tenant: Omit<CreateTenantData, 'slug'> & { slug: string },
  ): Promise<Tenant> {
    const tenantData = await this.prismaService.tenant.create({
      data: tenant,
    });

    return tenantData;
  }

  async get(): Promise<Tenant[]> {
    const tenants = await this.prismaService.tenant.findMany();
    return tenants;
  }

  findById(id: string): Promise<Tenant | null> {
    return this.prismaService.tenant.findUnique({ where: { id } });
  }

  findBySlug(slug: string): Promise<Tenant | null> {
    return this.prismaService.tenant.findUnique({ where: { slug } });
  }

  async updateTenant(
    tenantID: string,
    tenant: UpdateTenantDto,
  ): Promise<Tenant> {
    if (tenant == undefined) {
      throw new BadRequestException('Tenant data is required');
    }

    try {
      return await this.prismaService.tenant.update({
        where: {
          id: tenantID,
        },
        data: tenant,
      });
    } catch (error) {
      throw new NotFoundException('Tenant not found');
    }
  }

  async removeTenant(id: string) {
    try {
      await this.prismaService.tenant.delete({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Tenant deleted successfully',
      };
    } catch (error) {
      throw new NotFoundException('Tenant not found');
    }
  }
}
