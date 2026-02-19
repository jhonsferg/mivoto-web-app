import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ElectionService } from '@core/services/election.service';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-election-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './election-results.html',
  styleUrl: './election-results.scss',
})
export class ElectionResultsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly electionService = inject(ElectionService);
  private readonly dialog = inject(DialogService);

  public electionResults: any = null;
  public statistics: any = null;
  public isLoading = true;

  public ngOnInit(): void {
    const electionId = Number(this.route.snapshot.paramMap.get('id'));
    if (electionId) {
      this.loadResults(electionId);
      this.loadStatistics(electionId);
    }
  }

  private loadResults(electionId: number): void {
    this.isLoading = true;
    this.electionService.getElectionResults(electionId).subscribe({
      next: (response) => {
        this.electionResults = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dialog.error('Error', 'No se pudieron cargar los resultados');
        console.error('Error loading results:', error);
      },
    });
  }

  private loadStatistics(electionId: number): void {
    this.electionService.getElectionStatistics(electionId).subscribe({
      next: (response) => {
        this.statistics = response.data;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      },
    });
  }

  public goBack(): void {
    this.router.navigate(['/admin']);
  }

  public getPercentageClass(percentage: number): string {
    if (percentage >= 50) return 'high';
    if (percentage >= 25) return 'medium';
    return 'low';
  }
}
