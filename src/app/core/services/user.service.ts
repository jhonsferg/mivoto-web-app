import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { User } from '@core/models/user.model';

export interface CreateUserRequest {
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

export interface UpdateUserRequest {
  documentNumber?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = inject(ApiService);
  private readonly BASE_URL = 'users';

  public getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.api.get<ApiResponse<User[]>>(this.BASE_URL);
  }

  public getUserById(id: number): Observable<ApiResponse<User>> {
    return this.api.get<ApiResponse<User>>(`${this.BASE_URL}/${id}`);
  }

  public createUser(request: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.api.post<ApiResponse<User>>(this.BASE_URL, request);
  }

  public updateUser(id: number, request: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.api.put<ApiResponse<User>>(`${this.BASE_URL}/${id}`, request);
  }

  public deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.api.delete<ApiResponse<void>>(`${this.BASE_URL}/${id}`);
  }

  public activateUser(id: number): Observable<ApiResponse<void>> {
    return this.api.post<ApiResponse<void>>(`${this.BASE_URL}/${id}/activate`);
  }

  public deactivateUser(id: number): Observable<ApiResponse<void>> {
    return this.api.post<ApiResponse<void>>(`${this.BASE_URL}/${id}/deactivate`);
  }
}
