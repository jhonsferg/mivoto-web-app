import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { DialogService } from '../services/dialog.service';

/**
 * Global error interceptor to handle HTTP errors uniformly.
 * Displays user-friendly error messages and logs errors.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const dialogService = inject(DialogService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      // Skip error dialog for certain endpoints or errors already handled
      const skipDialog =
        req.url.includes('auth/login') ||
        req.url.includes('auth/refresh') ||
        error.status === 401; // 401 is handled by apiInterceptor

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Network Error: ${error.error.message}`;
        console.error('Client-side error:', error.error);
      } else {
        // Backend returned an unsuccessful response code
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad Request: The request could not be understood by the server';
            break;
          case 403:
            errorMessage = 'Access Denied: You do not have permission to access this resource';
            break;
          case 404:
            errorMessage = 'Not Found: The requested resource could not be found';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflict: The request could not be completed due to a conflict';
            break;
          case 422:
            errorMessage = error.error?.message || 'Validation Error: The provided data is invalid';
            break;
          case 500:
            errorMessage = 'Internal Server Error: Please try again later';
            break;
          case 502:
            errorMessage = 'Bad Gateway: The server is temporarily unavailable';
            break;
          case 503:
            errorMessage = 'Service Unavailable: The server is temporarily down for maintenance';
            break;
          default:
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = `Server Error (${error.status}): ${error.statusText}`;
            }
        }

        console.error(`HTTP Error ${error.status}:`, {
          url: req.url,
          method: req.method,
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message,
          error: error.error
        });
      }

      // Show error dialog only if not skipped
      if (!skipDialog) {
        dialogService.error('Error', errorMessage).subscribe();
      }

      return throwError(() => error);
    })
  );
};
