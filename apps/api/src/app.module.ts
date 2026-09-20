import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PrismaModule, databaseConfig } from '@repo/database-config';
import { IdentityModule } from './module/identity-service/Identity.module';
import { ControlPanelModule } from './module/control-pannel/controlPannel.module';

export const PRISMA = 'PRISMA';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
      load: [databaseConfig],
    }),
    PrismaModule,
    IdentityModule,
    ControlPanelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
