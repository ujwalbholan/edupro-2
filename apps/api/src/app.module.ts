import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PrismaModule, databaseConfig } from '@repo/database-config';
import { IdentityModule } from './module/identity-service/Identity.module';
import { ControlPanelModule } from './module/control-pannel/controlPannel.module';
import { HealthModule } from './module/health/health.module';
import { validateEnvironment } from './config/environment.validation';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';

export const PRISMA = 'PRISMA';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
      load: [databaseConfig],
      validate: validateEnvironment,
    }),
    PrismaModule,
    IdentityModule,
    ControlPanelModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, RequestLoggingInterceptor],
})
export class AppModule {}
