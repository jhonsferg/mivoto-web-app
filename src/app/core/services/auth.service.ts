import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { SessionService } from './session.service';
import { User } from '@core/models/user.model';
import { ApiResponse } from '@core/models/api-response.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private session = inject(SessionService);
  private readonly BASE_URL = 'auth';

  /**
   * Authenticates a user with the provided credentials.
   * @param credentials The username and password.
   * @returns An Observable containing the token and user data.
   */
  public login(credentials: { username: string; password: string }): Observable<any> {
    return this.api.post<{ token: string; user: User }>('auth/login', credentials).pipe(
      tap((response) => {
        this.session.setSession(response.token, response.user);
      }),
    );
  }

  /**
   * Logs out the current user, clears the session, and redirects to login.
   */
  public logout(): void {
    this.api.post<ApiResponse<void>>(`${this.BASE_URL}/logout`).subscribe({
      next: () => {
        this.session.clearSession();
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        // Even if API fails, clear session locally
        this.session.clearSession();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  /**
   * Retrieves the authenticated user's profile information.
   * @returns An Observable containing the user details.
   */
  public me(): Observable<ApiResponse<User>> {
    return this.api.get<ApiResponse<User>>(`${this.BASE_URL}/me`);
  }

  /**
   * Changes the password for the authenticated user.
   * @param request The password change request.
   * @returns An Observable indicating successful password change.
   */
  public changePassword(request: any): Observable<ApiResponse<void>> {
    return this.api.post<ApiResponse<void>>(`${this.BASE_URL}/change-password`, request);
  }
}
