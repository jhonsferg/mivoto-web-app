import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';
import { User } from '@core/models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private storage = inject(StorageService);
    private api = inject(ApiService);

    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'auth_user';

    // State
    private _currentUser = signal<User | null>(this.getUserFromStorage());
    private _token = signal<string | null>(this.storage.getItem(this.TOKEN_KEY));

    // Public Signals
    /**
     * Read-only signal for the current user.
     */
    public readonly currentUser = this._currentUser.asReadonly();

    /**
     * Computed signal indicating if the user is authenticated.
     */
    public readonly isAuthenticated = computed(() => !!this._token());

    /**
     * Computed signal for the current user's role.
     * Falls back to decoding the role from the JWT token if the user object lacks it.
     */
    public readonly userRole = computed(() => {
        const roleFromUser = this._currentUser()?.role;
        if (roleFromUser) return roleFromUser;
        const token = this._token();
        if (!token) return undefined;
        try {
            return this.jwtHelper.decodeToken(token)?.role as string | undefined;
        } catch {
            return undefined;
        }
    });

    /**
     * Sets the current session with the provided token and user.
     * @param token The JWT token.
     * @param user The authenticated user.
     */
    public setSession(token: string, user: User): void {
        this.storage.setItem(this.TOKEN_KEY, token);
        this.storage.setItem(this.USER_KEY, JSON.stringify(user));
        this._token.set(token);
        this._currentUser.set(user);
    }

    /**
     * Clears the current session and removes data from storage.
     */
    public clearSession(): void {
        this.storage.removeItem(this.TOKEN_KEY);
        this.storage.removeItem(this.USER_KEY);
        this._token.set(null);
        this._currentUser.set(null);
    }

    /**
     * Retrieves the current token.
     * @returns The current token or null if no session.
     */
    public getToken(): string | null {
        return this._token();
    }

    /**
     * Checks if the current token is expired.
     * @returns True if the token is expired or invalid, false otherwise.
     */
    private jwtHelper = new JwtHelperService();

    /**
     * Checks if the current token is expired.
     * @returns True if the token is expired or invalid, false otherwise.
     */
    public isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;
        return this.jwtHelper.isTokenExpired(token);
    }

    /**
     * Renews the current token via the API.
     * @returns An Observable that completes when the token is renewed.
     */
    public renewToken(): Observable<any> {
        return this.api.post<{ token: string }>('auth/refresh', {}).pipe(
            tap(response => {
                if (response.token) {
                    const user = this._currentUser();
                    if (user) {
                        this.setSession(response.token, user);
                    }
                }
            })
        );
    }

    /**
     * Retrieves the user from storage.
     * @returns The User object or null if not found.
     */
    private getUserFromStorage(): User | null {
        const user = this.storage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    }
}
