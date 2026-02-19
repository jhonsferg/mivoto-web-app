export interface Candidate {
  id: number;
  number: number;
  name: string;
  party: string;
  description: string;
  electionId: number;
  photoUrl?: string;
  active: boolean;
  voteCount: number;
}
