import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const details =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? exceptionResponse
        : undefined;
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : details && 'message' in details
          ? details.message
          : 'Internal server error';
    const requestId = request.headers['x-request-id'];

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        {
          requestId,
          method: request.method,
          path: request.originalUrl,
          exception,
        },
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      code: status === HttpStatus.BAD_REQUEST ? 'VALIDATION_ERROR' : undefined,
      message,
      errors: details && 'errors' in details ? details.errors : undefined,
      path: request.originalUrl,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
}
