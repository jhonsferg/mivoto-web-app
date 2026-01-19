import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { SessionService } from '../services/session.service';
import { AuthService } from '../services/auth.service';

// State to handle concurrent refreshes
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Helper to add token to request
  const addToken = (request: any, token: string | null) => {
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return request;
  };

  const token = sessionService.getToken();
  const authReq = addToken(req, token);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized
      if (error.status === 401) {

        // Ignore specific paths to prevent infinite loops (login, refresh, logout)
        if (req.url.includes('auth/login') || req.url.includes('auth/refresh')) {
          return throwError(() => error);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return sessionService.renewToken().pipe(
            switchMap((response) => {
              isRefreshing = false;
              // renewToken already updates session in SessionService
              const newToken = sessionService.getToken();
              refreshTokenSubject.next(newToken);
              return next(addToken(req, newToken));
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              // If refresh fails, logout
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          // Wait for token to be refreshed
          return refreshTokenSubject.pipe(
            filter(newToken => newToken !== null),
            take(1),
            switchMap(newToken => {
              return next(addToken(req, newToken));
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
