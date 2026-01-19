/**
 * Status of internal data structures.
 */
export interface DataStructuresStatus {
    voteQueue: string;
    voteRecordList: string;
    candidateSearchTree: string;
    electionGraph: string;
}

/**
 * Basic system health status.
 */
export interface HealthStatus {
    status: string;
    timestamp: string;
    database: string;
    dataStructures: DataStructuresStatus;
}

/**
 * Detailed system health status including metrics.
 */
export interface DetailedHealthStatus {
    status: string;
    timestamp: string;
    voteQueueSize: number;
    voteRecordsCount: number;
    candidateTreeSize: number;
    candidateTreeHeight: number;
    candidateTreeBalanced: boolean;
    electionGraphStats: any; // Define specifically if needed
}
