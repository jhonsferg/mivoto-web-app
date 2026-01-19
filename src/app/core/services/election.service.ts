import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { Election } from '@core/models/election.model';
import { CreateElectionRequest, UpdateElectionRequest, ElectionResultsDto, ElectionStatisticsDto } from '@core/dtos/election.dto';

@Injectable({
    providedIn: 'root',
})
export class ElectionService {
    private api = inject(ApiService);
    private readonly BASE_URL = 'elections';

    /**
     * Creates a new election.
     * @param request The election creation data.
     * @returns An Observable containing the created election.
     */
    public createElection(request: CreateElectionRequest): Observable<ApiResponse<Election>> {
        return this.api.post<ApiResponse<Election>>(this.BASE_URL, request);
    }

    /**
     * Retrieves all elections.
     * @returns An Observable containing a list of all elections.
     */
    public getAllElections(): Observable<ApiResponse<Election[]>> {
        return this.api.get<ApiResponse<Election[]>>(this.BASE_URL);
    }

    /**
     * Retrieves all active elections.
     * @returns An Observable containing a list of active elections.
     */
    public getActiveElections(): Observable<ApiResponse<Election[]>> {
        return this.api.get<ApiResponse<Election[]>>(`${this.BASE_URL}/active`);
    }

    /**
     * Retrieves a specific election by ID.
     * @param id The election ID.
     * @returns An Observable containing the election details.
     */
    public getElectionById(id: number): Observable<ApiResponse<Election>> {
        return this.api.get<ApiResponse<Election>>(`${this.BASE_URL}/${id}`);
    }

    /**
     * Updates an existing election.
     * @param id The election ID.
     * @param request The update data.
     * @returns An Observable containing the updated election.
     */
    public updateElection(id: number, request: UpdateElectionRequest): Observable<ApiResponse<Election>> {
        return this.api.put<ApiResponse<Election>>(`${this.BASE_URL}/${id}`, request);
    }

    /**
     * Starts a scheduled election.
     * @param id The election ID.
     * @returns An Observable indicating success.
     */
    public startElection(id: number): Observable<ApiResponse<void>> {
        return this.api.post<ApiResponse<void>>(`${this.BASE_URL}/${id}/start`);
    }

    /**
     * Closes an active election.
     * @param id The election ID.
     * @returns An Observable indicating success.
     */
    public closeElection(id: number): Observable<ApiResponse<void>> {
        return this.api.post<ApiResponse<void>>(`${this.BASE_URL}/${id}/close`);
    }

    /**
     * Cancels an election.
     * @param id The election ID.
     * @param reason The reason for cancellation (optional).
     * @returns An Observable indicating success.
     */
    public cancelElection(id: number, reason?: string): Observable<ApiResponse<void>> {
        let path = `${this.BASE_URL}/${id}/cancel`;
        if (reason) {
            path += `?reason=${encodeURIComponent(reason)}`;
        }
        return this.api.post<ApiResponse<void>>(path);
    }

    /**
     * Retrieves the results of an election.
     * @param id The election ID.
     * @returns An Observable containing the election results.
     */
    public getElectionResults(id: number): Observable<ApiResponse<ElectionResultsDto>> {
        return this.api.get<ApiResponse<ElectionResultsDto>>(`${this.BASE_URL}/${id}/results`);
    }

    /**
     * Retrieves statistics for an election.
     * @param id The election ID.
     * @returns An Observable containing the election statistics.
     */
    public getElectionStatistics(id: number): Observable<ApiResponse<ElectionStatisticsDto>> {
        return this.api.get<ApiResponse<ElectionStatisticsDto>>(`${this.BASE_URL}/${id}/statistics`);
    }

    /**
     * Retrieves elections filtered by status.
     * @param status The election status.
     * @returns An Observable containing a list of filtered elections.
     */
    public getElectionsByStatus(status: string): Observable<ApiResponse<Election[]>> {
        return this.api.get<ApiResponse<Election[]>>(`${this.BASE_URL}/status/${status}`);
    }
}
