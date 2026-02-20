import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { VoteResponse } from '@core/dtos/voting.dto';

@Component({
  selector: 'app-vote-confirmation',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './vote-confirmation.html',
  styleUrl: './vote-confirmation.scss',
})
export class VoteConfirmationComponent implements OnInit {
  public voteData = signal<VoteResponse | null>(null);
  public copied = signal(false);

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.voteData.set(navigation.extras.state['voteData']);
    }
  }

  public ngOnInit(): void {
    if (!this.voteData()) {
      this.router.navigate(['/voting']);
    }
  }

  public copyVoteHash(): void {
    if (this.voteData()?.voteHash) {
      navigator.clipboard.writeText(this.voteData()!.voteHash).then(() => {
        this.copied.set(true);
        setTimeout(() => {
          this.copied.set(false);
        }, 2000);
      });
    }
  }

  public goToElections(): void {
    this.router.navigate(['/voting']);
  }

  public goToHistory(): void {
    this.router.navigate(['/voting/history']);
  }

  public verifyVote(): void {
    if (this.voteData()?.voteHash) {
      this.router.navigate(['/voting/verify'], {
        queryParams: { hash: this.voteData()!.voteHash },
      });
    }
  }
}
