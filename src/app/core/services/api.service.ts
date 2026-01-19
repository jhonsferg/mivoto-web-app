import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  /**
   * Performs a GET request.
   * @param path The endpoint path.
   * @param params (Optional) HTTP parameters.
   * @returns An Observable of type T.
   */
  public get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${path}`, { params });
  }

  /**
   * Performs a POST request.
   * @param path The endpoint path.
   * @param body The request body.
   * @returns An Observable of type T.
   */
  public post<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${path}`, body);
  }

  /**
   * Performs a PUT request.
   * @param path The endpoint path.
   * @param body The request body.
   * @returns An Observable of type T.
   */
  public put<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${path}`, body);
  }

  /**
   * Performs a DELETE request.
   * @param path The endpoint path.
   * @returns An Observable of type T.
   */
  public delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${path}`);
  }
}
