import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list() {
    return this.prismaService.permission.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async findById(permissionId: string) {
    return this.prismaService.permission.findUnique({
      where: { id: permissionId },
    });
  }
}
