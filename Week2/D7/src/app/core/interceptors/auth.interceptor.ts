import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Functional Auth Interceptor: Attaches Bearer JWT token & X-Employee-Id to outgoing requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.currentUser();

  if (currentUser?.token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.token}`,
        'X-Employee-Id': currentUser.employeeId,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
