import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    // ⚠ Prisma Known Errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      errorCode = exception.code;
    }

    // ⚠ Prisma Validation Errors
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid data format sent to database.';
      errorCode = 'PRISMA_VALIDATION_ERROR';
    }

    //  NestJS HttpExceptions (NotFound, BadRequest, etc.)
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message;
      errorCode = (res as any).error || 'HTTP_EXCEPTION';
    }

    // LOG THE ERROR
    this.logger.error(
      `Status: ${status} Error: ${JSON.stringify(message)} → ${exception}`,
    );

    response.status(status).json({
      success: false,
      status,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
