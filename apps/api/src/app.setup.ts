import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';

export function configureApp(app: INestApplication) {
  const config = app.get(ConfigService);
  const corsOrigin = config.get<string>('CORS_ORIGIN');

  app.setGlobalPrefix('v1');
  app.enableShutdownHooks();
  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',').map((origin) => origin.trim()) : true,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(app.get(RequestLoggingInterceptor));
}
