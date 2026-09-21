import { Injectable } from '@nestjs/common';
import { PrismaService } from '@repo/database-config';
import { Prisma } from '@repo/database-config/dist/generated/prisma/client';

@Injectable()
export class InvitationalRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.InvitationUncheckedCreateInput) {
    return this.prismaService.invitation.create({ data });
  }
}
