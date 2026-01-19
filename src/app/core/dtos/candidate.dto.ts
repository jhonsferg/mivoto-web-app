/**
 * Request payload for creating or updating a candidate.
 */
export interface CreateCandidateRequest {
    name: string;
    electionId: number;
    party: string;
    number: number;
    photoUrl?: string; // If applicable
    description?: string;
}

/**
 * Data transfer object representing a candidate.
 */
export interface CandidateDto {
    id: number;
    name: string;
    party: string;
    number: number;
    electionId: number;
    isActive: boolean;
    // Add other fields matching CandidateDto
}
