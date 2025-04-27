import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class FullIImageUrlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data)) {
          return data.map(item => this.convertRelativeUrls(item, baseUrl));
        } else if (data && typeof data === 'object') {
          return this.convertRelativeUrls(data, baseUrl);
        }
        return data; 
      }),
    );
  }

  private convertRelativeUrls(item: any, baseUrl: string): any {
    if (item.url && typeof item.url === 'string' && !item.url.startsWith('http')) {

      item.url = `${baseUrl}${item.url}`;
    }
    return item;
  }
}