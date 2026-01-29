// transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  data: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // Kalau data sudah dalam format response, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Transform data ke format standard
        return {
          success: true,
          statusCode: response.statusCode || HttpStatus.OK,
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          data: data,
          message: this.getDefaultMessage(request.method, response.statusCode),
        };
      }),
    );
  }

  private getDefaultMessage(method: string, statusCode: number): string {
    if (statusCode === HttpStatus.CREATED) {
      return 'Resource created successfully';
    }
    if (method === 'DELETE') {
      return 'Resource deleted successfully';
    }
    if (method === 'PUT' || method === 'PATCH') {
      return 'Resource updated successfully';
    }
    return 'Success';
  }
}
