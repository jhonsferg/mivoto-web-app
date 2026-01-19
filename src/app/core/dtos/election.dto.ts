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
 * Data transfer object representing election results.
 */
export interface ElectionResultsDto {
    electionTitle: string;
    totalVotes: number;
    results: { [candidateName: string]: number };
    winner: string;
}

/**
 * Data transfer object representing election statistics.
 */
export interface ElectionStatisticsDto {
    totalVotes: number;
    participationRate: number;
    // Add other fields as per backend response
}
