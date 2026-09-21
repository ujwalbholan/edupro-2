import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const requestId =
      typeof request.headers['x-request-id'] === 'string'
        ? request.headers['x-request-id']
        : randomUUID();
    const startedAt = performance.now();

    response.setHeader('x-request-id', requestId);

    return next.handle().pipe(
      finalize(() => {
        this.logger.log({
          requestId,
          method: request.method,
          path: request.originalUrl,
          statusCode: response.statusCode,
          durationMs: Math.round(performance.now() - startedAt),
        });
      }),
    );
  }
}
