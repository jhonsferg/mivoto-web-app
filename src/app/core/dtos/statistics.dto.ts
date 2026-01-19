/**
 * Data transfer object for system-wide statistics.
 */
export interface SystemStatistics {
    totalElections: number;
    activeElections: number;
    totalVotes: number;
    totalCandidates: number;
}

/**
 * Data transfer object for election-specific statistics.
 */
export interface ElectionStatistics {
    totalVotes: number;
    participationRate: number;
    winningCandidate: string;
    // Add other fields as per backend response
}

/**
 * Data transfer object for candidate-specific statistics.
 */
export interface CandidateStatistics {
    candidateId: number;
    candidateName: string;
    voteCount: number;
    percentage: number;
}
