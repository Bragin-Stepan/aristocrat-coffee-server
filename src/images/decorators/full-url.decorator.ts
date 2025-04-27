import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class FullUrlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    return next.handle().pipe(
      map(data => this.convertRelativeUrls(data, baseUrl)),
    );
  }

  private convertRelativeUrls(item: any, baseUrl: string): any {
    if (Array.isArray(item)) {
      return item.map(element => this.convertRelativeUrls(element, baseUrl));
    } else if (item && typeof item === 'object') {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          if (key === 'url' && typeof item[key] === 'string' && !item[key].startsWith('http')) {
            item[key] = `${baseUrl}${item[key]}`;
          } else if (typeof item[key] === 'object' || Array.isArray(item[key])) {
            item[key] = this.convertRelativeUrls(item[key], baseUrl);
          }
        }
      }
    }
    return item;
  }
}