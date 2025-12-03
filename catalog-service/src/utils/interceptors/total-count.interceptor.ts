import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TotalCountInterceptor<T> implements NestInterceptor<T, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: { totalCount: number; data: T[] }) => {
        context
          .switchToHttp()
          .getResponse()
          .set('x-total-count', data.totalCount);
        return data;
      }),
    );
  }
}
