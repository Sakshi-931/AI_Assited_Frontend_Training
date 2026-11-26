import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Functional Error Interceptor: Standardizes error logging and human-readable diagnostic messages
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let diagnosticMessage = 'An unexpected network error occurred.';

      if (error.status === 0) {
        diagnosticMessage = 'Backend server is unreachable. Operating with local fallback data.';
      } else if (error.status === 401) {
        diagnosticMessage = 'Unauthorized session. Please log in again.';
      } else if (error.status === 403) {
        diagnosticMessage = 'Access restricted (Server is in Read-Only mode or unauthorized).';
      } else if (error.status === 404) {
        diagnosticMessage = `Requested resource was not found (${req.url}).`;
      } else if (error.status >= 500) {
        diagnosticMessage = `Server encountered an internal error (${error.status}).`;
      }

      console.error(`[Global Error Interceptor] ${diagnosticMessage}`, error);
      return throwError(() => new Error(diagnosticMessage));
    })
  );
};
