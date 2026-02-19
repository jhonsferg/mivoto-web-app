import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { AuditAction } from '@core/enums/audit-action.enum';
import { AuditLog, AuditReport } from '@core/dtos/audit.dto';

@Injectable({
    providedIn: 'root',
})
export class AuditService {
    private api = inject(ApiService);
    private readonly BASE_URL = 'audit';

    /**
     * Retrieves all audit logs.
     * @returns An Observable containing a list of all audit logs.
     */
    public getAllAuditLogs(): Observable<ApiResponse<AuditLog[]>> {
        return this.api.get<ApiResponse<AuditLog[]>>(this.BASE_URL);
    }

    /**
     * Retrieves audit logs for a specific user.
     * @param userId The ID of the user.
     * @returns An Observable containing a list of audit logs.
     */
    public getAuditTrailByUser(userId: number): Observable<ApiResponse<AuditLog[]>> {
        return this.api.get<ApiResponse<AuditLog[]>>(`${this.BASE_URL}/user/${userId}`);
    }

    /**
     * Retrieves audit logs for a specific entity.
     * @param entity The entity name.
     * @param entityId The entity ID.
     * @returns An Observable containing a list of audit logs.
     */
    public getAuditTrailByEntity(entity: string, entityId: number): Observable<ApiResponse<AuditLog[]>> {
        return this.api.get<ApiResponse<AuditLog[]>>(`${this.BASE_URL}/entity/${entity}/${entityId}`);
    }

    /**
     * Retrieves audit logs by action type.
     * @param action The type of action performed.
     * @returns An Observable containing a list of audit logs.
     */
    public getAuditTrailByAction(action: AuditAction): Observable<ApiResponse<AuditLog[]>> {
        return this.api.get<ApiResponse<AuditLog[]>>(`${this.BASE_URL}/action/${action}`);
    }

    /**
     * Retrieves audit logs within a specified date range.
     * @param startDate The start date of the range (ISO String).
     * @param endDate The end date of the range (ISO String).
     * @returns An Observable containing a list of audit logs.
     */
    public getAuditTrailByDateRange(startDate: string, endDate: string): Observable<ApiResponse<AuditLog[]>> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate);
        return this.api.get<ApiResponse<AuditLog[]>>(`${this.BASE_URL}/date-range`, params);
    }

    /**
     * Retrieves critical audit logs.
     * @returns An Observable containing a list of critical audit logs.
     */
    public getCriticalAuditLogs(): Observable<ApiResponse<AuditLog[]>> {
        return this.api.get<ApiResponse<AuditLog[]>>(`${this.BASE_URL}/critical`);
    }

    /**
     * Retrieves security-related audit logs.
     * @returns An Observable containing a list of security audit logs.
     */
    public getSecurityAuditLogs(): Observable<ApiResponse<AuditLog[]>> {
        return this.api.get<ApiResponse<AuditLog[]>>(`${this.BASE_URL}/security`);
    }

    /**
     * Retrieves voting-related audit logs.
     * @returns An Observable containing a list of voting audit logs.
     */
    public getVotingAuditLogs(): Observable<ApiResponse<AuditLog[]>> {
        return this.api.get<ApiResponse<AuditLog[]>>(`${this.BASE_URL}/voting`);
    }

    /**
     * Generates an audit report for a specified date range.
     * @param startDate The start date.
     * @param endDate The end date.
     * @returns An Observable containing the generated audit report.
     */
    public generateAuditReport(startDate: string, endDate: string): Observable<ApiResponse<AuditReport>> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate);
        return this.api.get<ApiResponse<AuditReport>>(`${this.BASE_URL}/report`, params);
    }
}
