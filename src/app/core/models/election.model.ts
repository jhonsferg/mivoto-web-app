import { Candidate } from './candidate.model';

export enum ElectionStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export interface Election {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ElectionStatus;
  maxVotesPerUser: number;
  allowsBlankVote: boolean;
  requiresVerification: boolean;
  candidates?: Candidate[];
  hasVoted?: boolean;
  createdAt: string;
}
