import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { CreateCandidateRequest, CandidateDto } from '@core/dtos/candidate.dto';

@Injectable({
    providedIn: 'root',
})
export class CandidateService {
    private api = inject(ApiService);
    private readonly BASE_URL = 'candidates';

    /**
     * Registers a new candidate for an election.
     * @param request The candidate creation request.
     * @returns An Observable containing the registered candidate data.
     */
    public registerCandidate(request: CreateCandidateRequest): Observable<ApiResponse<CandidateDto>> {
        return this.api.post<ApiResponse<CandidateDto>>(this.BASE_URL, request);
    }

    /**
     * Retrieves a candidate by its unique ID.
     * @param id The candidate ID.
     * @returns An Observable containing the candidate data.
     */
    public getCandidateById(id: number): Observable<ApiResponse<CandidateDto>> {
        return this.api.get<ApiResponse<CandidateDto>>(`${this.BASE_URL}/${id}`);
    }

    /**
     * Retrieves all candidates for a specific election.
     * @param electionId The election ID.
     * @returns An Observable containing a list of candidates.
     */
    public getCandidatesByElection(electionId: number): Observable<ApiResponse<CandidateDto[]>> {
        return this.api.get<ApiResponse<CandidateDto[]>>(`${this.BASE_URL}/election/${electionId}`);
    }

    /**
     * Retrieves active candidates for a specific election.
     * @param electionId The election ID.
     * @returns An Observable containing a list of active candidates.
     */
    public getActiveCandidates(electionId: number): Observable<ApiResponse<CandidateDto[]>> {
        return this.api.get<ApiResponse<CandidateDto[]>>(`${this.BASE_URL}/election/${electionId}/active`);
    }

    /**
     * Finds a candidate by their number in a specific election.
     * @param electionId The election ID.
     * @param number The candidate number.
     * @returns An Observable containing the candidate data.
     */
    public findCandidateByNumber(electionId: number, number: number): Observable<ApiResponse<CandidateDto>> {
        return this.api.get<ApiResponse<CandidateDto>>(`${this.BASE_URL}/election/${electionId}/number/${number}`);
    }

    /**
     * Retrieves candidates for an election ordered by their number.
     * @param electionId The election ID.
     * @returns An Observable containing a list of ordered candidates.
     */
    public getCandidatesOrderedByNumber(electionId: number): Observable<ApiResponse<CandidateDto[]>> {
        return this.api.get<ApiResponse<CandidateDto[]>>(`${this.BASE_URL}/election/${electionId}/ordered`);
    }

    /**
     * Finds candidates belonging to a specific political party.
     * @param party The party name.
     * @returns An Observable containing a list of candidates.
     */
    public findByParty(party: string): Observable<ApiResponse<CandidateDto[]>> {
        return this.api.get<ApiResponse<CandidateDto[]>>(`${this.BASE_URL}/party/${party}`);
    }

    /**
     * Updates an existing candidate.
     * @param id The candidate ID.
     * @param request The update request data.
     * @returns An Observable containing the updated candidate data.
     */
    public updateCandidate(id: number, request: CreateCandidateRequest): Observable<ApiResponse<CandidateDto>> {
        return this.api.put<ApiResponse<CandidateDto>>(`${this.BASE_URL}/${id}`, request);
    }

    /**
     * Activates a disabled candidate.
     * @param id The candidate ID.
     * @returns An Observable indicating successful activation.
     */
    public activateCandidate(id: number): Observable<ApiResponse<void>> {
        return this.api.post<ApiResponse<void>>(`${this.BASE_URL}/${id}/activate`);
    }

    /**
     * Deactivates a candidate.
     * @param id The candidate ID.
     * @returns An Observable indicating successful deactivation.
     */
    public deactivateCandidate(id: number): Observable<ApiResponse<void>> {
        return this.api.post<ApiResponse<void>>(`${this.BASE_URL}/${id}/deactivate`);
    }

    /**
     * Deletes a candidate.
     * @param id The candidate ID.
     * @returns An Observable indicating successful deletion.
     */
    public deleteCandidate(id: number): Observable<ApiResponse<void>> {
        return this.api.delete<ApiResponse<void>>(`${this.BASE_URL}/${id}`);
    }
}
