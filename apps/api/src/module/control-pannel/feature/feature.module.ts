import { Module } from '@nestjs/common';
import { FeatureService } from './application/feature.service';
import { FeatureRepository } from './infrastructure/feature.repository';
import { FeatureController } from './presentation/feature.controller';

@Module({
  controllers: [FeatureController],
  providers: [FeatureService, FeatureRepository],
  exports: [FeatureService, FeatureRepository],
})
export class FeatureModule {}
