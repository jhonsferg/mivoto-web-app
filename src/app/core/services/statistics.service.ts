import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { SystemStatistics, ElectionStatistics, CandidateStatistics } from '@core/dtos/statistics.dto';

@Injectable({
    providedIn: 'root',
})
export class StatisticsService {
    private api = inject(ApiService);
    private readonly BASE_URL = 'statistics';

    /**
     * Retrieves global system statistics.
     * @returns An Observable containing system statistics.
     */
    public getSystemStatistics(): Observable<ApiResponse<SystemStatistics>> {
        return this.api.get<ApiResponse<SystemStatistics>>(`${this.BASE_URL}/system`);
    }

    /**
     * Retrieves statistics for a specific election.
     * @param electionId The election ID.
     * @returns An Observable containing election statistics.
     */
    public getElectionStatistics(electionId: number): Observable<ApiResponse<ElectionStatistics>> {
        return this.api.get<ApiResponse<ElectionStatistics>>(`${this.BASE_URL}/election/${electionId}`);
    }

    /**
     * Retrieves statistics for candidates in an election.
     * @param electionId The election ID.
     * @returns An Observable containing list of candidate statistics.
     */
    public getCandidateStatistics(electionId: number): Observable<ApiResponse<CandidateStatistics[]>> {
        return this.api.get<ApiResponse<CandidateStatistics[]>>(`${this.BASE_URL}/election/${electionId}/candidates`);
    }

    /**
     * Retrieves voting participation statistics by hour.
     * @param electionId The election ID.
     * @returns An Observable containing participation map (hour -> count).
     */
    public getVotingParticipationByHour(electionId: number): Observable<ApiResponse<{ [hour: number]: number }>> {
        return this.api.get<ApiResponse<{ [hour: number]: number }>>(`${this.BASE_URL}/election/${electionId}/participation`);
    }
}
