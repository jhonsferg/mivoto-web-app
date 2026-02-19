import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VotingService } from '@core/services/voting.service';
import { DialogService } from '@core/services/dialog.service';
import { VoteRecordDto } from '@core/dtos/voting.dto';

@Component({
  selector: 'app-vote-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vote-verification.html',
  styleUrl: './vote-verification.scss',
})
export class VoteVerificationComponent implements OnInit {
  private readonly votingService = inject(VotingService);
  private readonly dialog = inject(DialogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public voteHash = '';
  public isVerifying = false;
  public voteRecord: VoteRecordDto | null = null;
  public verificationError = '';

  public ngOnInit(): void {
    const hashParam = this.route.snapshot.queryParamMap.get('hash');
    if (hashParam) {
      this.voteHash = hashParam;
      this.verifyVote();
    }
  }

  public verifyVote(): void {
    if (!this.voteHash.trim()) {
      this.verificationError = 'Por favor, ingresa un hash de voto';
      return;
    }

    this.isVerifying = true;
    this.verificationError = '';
    this.voteRecord = null;

    this.votingService.verifyVote(this.voteHash).subscribe({
      next: (response) => {
        this.voteRecord = response.data;
        this.isVerifying = false;
      },
      error: (error) => {
        this.isVerifying = false;
        this.verificationError =
          error.error?.message || 'No se pudo verificar el voto. Hash inválido o voto no encontrado.';
        this.dialog.error('Error de Verificación', this.verificationError);
        console.error('Error verifying vote:', error);
      },
    });
  }

  public clearForm(): void {
    this.voteHash = '';
    this.voteRecord = null;
    this.verificationError = '';
  }

  public goBack(): void {
    this.router.navigate(['/voting']);
  }
}
