/**
 * Request payload for casting a vote.
 */
export interface VoteRequest {
    electionId: number;
    candidateId: number;
}

/**
 * Response payload after casting a vote.
 */
export interface VoteResponse {
    voteHash: string;
    timestamp: string;
}

/**
 * Data transfer object representing a vote record.
 */
export interface VoteRecordDto {
    voteHash: string;
    electionTitle: string;
    candidateName: string;
    timestamp: string;
}
