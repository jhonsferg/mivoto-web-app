import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectionService } from '@core/services/election.service';
import { CandidateService } from '@core/services/candidate.service';
import { VotingService } from '@core/services/voting.service';
import { DialogService } from '@core/services/dialog.service';
import { Election } from '@core/models/election.model';
import { CandidateDto } from '@core/dtos/candidate.dto';

@Component({
  selector: 'app-election-detail',
  standalone: true,
  imports: [DatePipe],
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

  public election = signal<Election | null>(null);
  public candidates = signal<CandidateDto[]>([]);
  public selectedCandidateId = signal<number | null>(null);
  public isLoading = signal(true);
  public hasVoted = signal(false);
  public isSubmittingVote = signal(false);

  public ngOnInit(): void {
    const electionId = Number(this.route.snapshot.paramMap.get('id'));
    if (electionId) {
      this.loadElectionData(electionId);
      this.checkVotingStatus(electionId);
    }
  }

  private loadElectionData(electionId: number): void {
    this.isLoading.set(true);

    this.electionService.getElectionById(electionId).subscribe({
      next: (response) => {
        this.election.set(response.data);
        this.loadCandidates(electionId);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.dialog.error('Error', 'No se pudo cargar la información de la elección');
        console.error('Error loading election:', error);
      },
    });
  }

  private loadCandidates(electionId: number): void {
    this.candidateService.getActiveCandidates(electionId).subscribe({
      next: (response) => {
        this.candidates.set(response.data || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.dialog.error('Error', 'No se pudieron cargar los candidatos');
        console.error('Error loading candidates:', error);
      },
    });
  }

  private checkVotingStatus(electionId: number): void {
    this.votingService.checkVotingStatus(electionId).subscribe({
      next: (response) => {
        this.hasVoted.set(response.data);
      },
      error: (error) => {
        console.error('Error checking voting status:', error);
      },
    });
  }

  public selectCandidate(candidateId: number): void {
    if (!this.hasVoted()) {
      this.selectedCandidateId.set(candidateId);
    }
  }

  public castVote(): void {
    if (!this.selectedCandidateId() || !this.election() || this.hasVoted()) {
      return;
    }

    this.isSubmittingVote.set(true);

    this.votingService
      .castVote({
        electionId: this.election()!.id,
        candidateId: this.selectedCandidateId()!,
      })
      .subscribe({
        next: (response) => {
          this.isSubmittingVote.set(false);
          this.hasVoted.set(true);
          this.router.navigate(['/voting/confirmation'], {
            state: { voteData: response.data },
          });
        },
        error: (error) => {
          this.isSubmittingVote.set(false);
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
    if (!this.election()) return false;
    const now = new Date();
    const startDate = new Date(this.election()!.startDate);
    const endDate = new Date(this.election()!.endDate);
    return now >= startDate && now <= endDate;
  }
}
