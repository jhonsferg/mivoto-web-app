import { Component, OnInit, inject, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectionService } from '@core/services/election.service';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-election-results',
  standalone: true,
  imports: [KeyValuePipe],
  templateUrl: './election-results.html',
  styleUrl: './election-results.scss',
})
export class ElectionResultsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly electionService = inject(ElectionService);
  private readonly dialog = inject(DialogService);

  public electionResults = signal<any>(null);
  public statistics = signal<any>(null);
  public isLoading = signal(true);

  public ngOnInit(): void {
    const electionId = Number(this.route.snapshot.paramMap.get('id'));
    if (electionId) {
      this.loadResults(electionId);
      this.loadStatistics(electionId);
    }
  }

  private loadResults(electionId: number): void {
    this.isLoading.set(true);
    this.electionService.getElectionResults(electionId).subscribe({
      next: (response) => {
        this.electionResults.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.dialog.error('Error', 'No se pudieron cargar los resultados');
        console.error('Error loading results:', error);
      },
    });
  }

  private loadStatistics(electionId: number): void {
    this.electionService.getElectionStatistics(electionId).subscribe({
      next: (response) => {
        this.statistics.set(response.data);
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
