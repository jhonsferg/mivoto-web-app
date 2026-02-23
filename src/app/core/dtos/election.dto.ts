/**
 * Request payload for creating an election.
 */
export interface CreateElectionRequest {
    title: string;
    description: string;
    startDate: string; // ISO DateTime
    endDate: string; // ISO DateTime
}

/**
 * Request payload for updating an election.
 */
export interface UpdateElectionRequest {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

/**
 * Individual candidate result within an election.
 */
export interface CandidateResult {
    candidateId: number;
    candidateName: string;
    party: string;
    number: number;
    votes: number;
    percentage: number;
}

/**
 * Data transfer object representing election results.
 */
export interface ElectionResultsDto {
    electionTitle: string;
    totalVotes: number;
    results: CandidateResult[];
    winner: string;
}

/**
 * Data transfer object representing election statistics.
 */
export interface ElectionStatisticsDto {
    totalVotes: number;
    participationRate: number;
    totalCandidates: number;
    leadingCandidate?: {
        name: string;
        votes?: number;
    };
    votesByParty?: { [party: string]: number };
}
