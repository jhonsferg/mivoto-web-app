export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  party: string;
  position: string;
  electionId: number;
  imageUrl?: string;
}
