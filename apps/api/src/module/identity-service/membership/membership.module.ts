import { Module } from '@nestjs/common';
import { MembershipService } from './application/membership.service';
import { MembershipRepository } from './infrastructure/membership.repository';
import { MembershipController } from './presentation/membership.controller';

@Module({
  controllers: [MembershipController],
  providers: [MembershipService, MembershipRepository],
  exports: [MembershipService, MembershipRepository],
})
export class MembershipModule {}
