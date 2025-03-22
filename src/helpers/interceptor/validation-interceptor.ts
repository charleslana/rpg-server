import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ValidationInterceptor.name);

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (error.response && error.response.message) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          this.logger.error(`Validation failed: ${error.response.message}`);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          this.logger.error(`Validation failed: ${error.message}`);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return throwError(() => error);
      }),
    );
  }
}
