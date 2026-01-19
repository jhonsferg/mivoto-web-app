import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { HealthStatus, DetailedHealthStatus } from '@core/dtos/health.dto';

@Injectable({
    providedIn: 'root',
})
export class HealthService {
    private api = inject(ApiService);
    private readonly BASE_URL = 'health';

    /**
     * Performs a basic health check.
     * @returns An Observable containing the system status.
     */
    public healthCheck(): Observable<ApiResponse<HealthStatus>> {
        return this.api.get<ApiResponse<HealthStatus>>(this.BASE_URL);
    }

    /**
     * Performs a detailed health check including internal data structures stats.
     * @returns An Observable containing detailed system status.
     */
    public detailedHealthCheck(): Observable<ApiResponse<DetailedHealthStatus>> {
        return this.api.get<ApiResponse<DetailedHealthStatus>>(`${this.BASE_URL}/detailed`);
    }
}
