import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VotingService } from '@core/services/voting.service';
import { DialogService } from '@core/services/dialog.service';
import { VoteRecordDto } from '@core/dtos/voting.dto';

@Component({
  selector: 'app-vote-verification',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './vote-verification.html',
  styleUrl: './vote-verification.scss',
})
export class VoteVerificationComponent implements OnInit {
  private readonly votingService = inject(VotingService);
  private readonly dialog = inject(DialogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public voteHash = signal('');
  public isVerifying = signal(false);
  public voteRecord = signal<VoteRecordDto | null>(null);
  public verificationError = signal('');

  public ngOnInit(): void {
    const hashParam = this.route.snapshot.queryParamMap.get('hash');
    if (hashParam) {
      this.voteHash.set(hashParam);
      this.verifyVote();
    }
  }

  public verifyVote(): void {
    if (!this.voteHash().trim()) {
      this.verificationError.set('Por favor, ingresa un hash de voto');
      return;
    }

    this.isVerifying.set(true);
    this.verificationError.set('');
    this.voteRecord.set(null);

    this.votingService.verifyVote(this.voteHash()).subscribe({
      next: (response) => {
        this.voteRecord.set(response.data);
        this.isVerifying.set(false);
      },
      error: (error) => {
        this.isVerifying.set(false);
        this.verificationError.set(
          error.error?.message || 'No se pudo verificar el voto. Hash inválido o voto no encontrado.'
        );
        this.dialog.error('Error de Verificación', this.verificationError());
        console.error('Error verifying vote:', error);
      },
    });
  }

  public clearForm(): void {
    this.voteHash.set('');
    this.voteRecord.set(null);
    this.verificationError.set('');
  }

  public goBack(): void {
    this.router.navigate(['/voting']);
  }
}
