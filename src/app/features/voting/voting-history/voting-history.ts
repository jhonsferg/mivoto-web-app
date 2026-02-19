import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VotingService } from '@core/services/voting.service';
import { DialogService } from '@core/services/dialog.service';
import { VoteRecordDto } from '@core/dtos/voting.dto';

@Component({
  selector: 'app-voting-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voting-history.html',
  styleUrl: './voting-history.scss',
})
export class VotingHistoryComponent implements OnInit {
  private readonly votingService = inject(VotingService);
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);

  public voteRecords: VoteRecordDto[] = [];
  public isLoading = true;
  public errorMessage = '';

  public ngOnInit(): void {
    this.loadVotingHistory();
  }

  private loadVotingHistory(): void {
    this.isLoading = true;
    this.votingService.getVotingHistory().subscribe({
      next: (response) => {
        this.voteRecords = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el historial de votos';
        this.isLoading = false;
        this.dialog.error('Error', this.errorMessage);
        console.error('Error loading voting history:', error);
      },
    });
  }

  public verifyVote(voteHash: string): void {
    this.router.navigate(['/voting/verify'], {
      queryParams: { hash: voteHash },
    });
  }

  public copyHash(voteHash: string): void {
    navigator.clipboard.writeText(voteHash).then(() => {
      this.dialog.success('Copiado', 'Hash copiado al portapapeles');
    });
  }

  public goBack(): void {
    this.router.navigate(['/voting']);
  }
}
