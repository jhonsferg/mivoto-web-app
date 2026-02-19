import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ElectionService } from '@core/services/election.service';
import { CandidateService } from '@core/services/candidate.service';
import { VotingService } from '@core/services/voting.service';
import { DialogService } from '@core/services/dialog.service';
import { Election } from '@core/models/election.model';
import { CandidateDto } from '@core/dtos/candidate.dto';

@Component({
  selector: 'app-election-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './election-detail.html',
  styleUrl: './election-detail.scss',
})
export class ElectionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly electionService = inject(ElectionService);
  private readonly candidateService = inject(CandidateService);
  private readonly votingService = inject(VotingService);
  private readonly dialog = inject(DialogService);

  public election: Election | null = null;
  public candidates: CandidateDto[] = [];
  public selectedCandidateId: number | null = null;
  public isLoading = true;
  public hasVoted = false;
  public isSubmittingVote = false;

  public ngOnInit(): void {
    const electionId = Number(this.route.snapshot.paramMap.get('id'));
    if (electionId) {
      this.loadElectionData(electionId);
      this.checkVotingStatus(electionId);
    }
  }

  private loadElectionData(electionId: number): void {
    this.isLoading = true;

    this.electionService.getElectionById(electionId).subscribe({
      next: (response) => {
        this.election = response.data;
        this.loadCandidates(electionId);
      },
      error: (error) => {
        this.isLoading = false;
        this.dialog.error('Error', 'No se pudo cargar la información de la elección');
        console.error('Error loading election:', error);
      },
    });
  }

  private loadCandidates(electionId: number): void {
    this.candidateService.getActiveCandidates(electionId).subscribe({
      next: (response) => {
        this.candidates = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dialog.error('Error', 'No se pudieron cargar los candidatos');
        console.error('Error loading candidates:', error);
      },
    });
  }

  private checkVotingStatus(electionId: number): void {
    this.votingService.checkVotingStatus(electionId).subscribe({
      next: (response) => {
        this.hasVoted = response.data;
      },
      error: (error) => {
        console.error('Error checking voting status:', error);
      },
    });
  }

  public selectCandidate(candidateId: number): void {
    if (!this.hasVoted) {
      this.selectedCandidateId = candidateId;
    }
  }

  public castVote(): void {
    if (!this.selectedCandidateId || !this.election || this.hasVoted) {
      return;
    }

    this.isSubmittingVote = true;

    this.votingService
      .castVote({
        electionId: this.election.id,
        candidateId: this.selectedCandidateId,
      })
      .subscribe({
        next: (response) => {
          this.isSubmittingVote = false;
          this.hasVoted = true;
          this.router.navigate(['/voting/confirmation'], {
            state: { voteData: response.data },
          });
        },
        error: (error) => {
          this.isSubmittingVote = false;
          this.dialog.error(
            'Error',
            error.error?.message || 'No se pudo registrar tu voto. Por favor, intenta nuevamente.'
          );
          console.error('Error casting vote:', error);
        },
      });
  }

  public goBack(): void {
    this.router.navigate(['/voting']);
  }

  public isElectionActive(): boolean {
    if (!this.election) return false;
    const now = new Date();
    const startDate = new Date(this.election.startDate);
    const endDate = new Date(this.election.endDate);
    return now >= startDate && now <= endDate;
  }
}
