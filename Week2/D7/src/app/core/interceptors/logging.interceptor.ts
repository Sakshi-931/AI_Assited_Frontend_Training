import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Functional Logging Interceptor: Measures network latency and logs HTTP traffic in dev mode
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.enableHttpLogs) {
    return next(req);
  }

  const startTime = Date.now();
  console.log(`[HTTP Request] 🚀 ${req.method} ${req.urlWithParams}`);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          const elapsed = Date.now() - startTime;
          console.log(`[HTTP Response] ✅ ${event.status} ${req.method} ${req.url} (${elapsed}ms)`);
        }
      },
      error: (error) => {
        const elapsed = Date.now() - startTime;
        console.warn(`[HTTP Error] ⚠️ ${error.status || 'OFFLINE'} ${req.method} ${req.url} (${elapsed}ms)`);
      },
    })
  );
};
