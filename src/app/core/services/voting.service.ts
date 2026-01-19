import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { VoteRequest, VoteResponse, VoteRecordDto } from '@core/dtos/voting.dto';

@Injectable({
    providedIn: 'root',
})
export class VotingService {
    private api = inject(ApiService);
    private readonly BASE_URL = 'votes';

    /**
     * Casts a vote for a candidate in an election.
     * @param request The vote request containing election and candidate IDs.
     * @returns An Observable containing the vote response.
     */
    public castVote(request: VoteRequest): Observable<ApiResponse<VoteResponse>> {
        return this.api.post<ApiResponse<VoteResponse>>(this.BASE_URL, request);
    }

    /**
     * Verifies a vote using its unique hash.
     * @param voteHash The unique hash of the vote.
     * @returns An Observable containing the vote record details.
     */
    public verifyVote(voteHash: string): Observable<ApiResponse<VoteRecordDto>> {
        return this.api.get<ApiResponse<VoteRecordDto>>(`${this.BASE_URL}/verify/${voteHash}`);
    }

    /**
     * Retrieves the voting history of the authenticated user.
     * @returns An Observable containing a list of vote records.
     */
    public getVotingHistory(): Observable<ApiResponse<VoteRecordDto[]>> {
        return this.api.get<ApiResponse<VoteRecordDto[]>>(`${this.BASE_URL}/history`);
    }

    /**
     * Checks if the authenticated user has already voted in a specific election.
     * @param electionId The election ID.
     * @returns An Observable containing true if voted, false otherwise.
     */
    public checkVotingStatus(electionId: number): Observable<ApiResponse<boolean>> {
        return this.api.get<ApiResponse<boolean>>(`${this.BASE_URL}/status/${electionId}`);
    }

    /**
     * Counts the total votes for an election.
     * @param electionId The election ID.
     * @returns An Observable containing the total vote count.
     */
    public countVotesByElection(electionId: number): Observable<ApiResponse<number>> {
        return this.api.get<ApiResponse<number>>(`${this.BASE_URL}/election/${electionId}/count`);
    }
}
