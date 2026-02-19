import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ElectionService } from '@core/services/election.service';
import { StatisticsService } from '@core/services/statistics.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly electionService = inject(ElectionService);
  private readonly statisticsService = inject(StatisticsService);

  public systemStats: any = null;
  public recentElections: any[] = [];
  public isLoading = true;

  public ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    this.statisticsService.getSystemStatistics().subscribe({
      next: (response) => {
        this.systemStats = response.data;
      },
      error: (error) => {
        console.error('Error loading system stats:', error);
      },
    });

    this.electionService.getAllElections().subscribe({
      next: (response) => {
        this.recentElections = (response.data || []).slice(0, 5);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading elections:', error);
        this.isLoading = false;
      },
    });
  }

  public navigateToElections(): void {
    this.router.navigate(['/admin/elections']);
  }

  public navigateToCandidates(): void {
    this.router.navigate(['/admin/candidates']);
  }

  public navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  public navigateToAudit(): void {
    this.router.navigate(['/admin/audit']);
  }

  public navigateToSettings(): void {
    this.router.navigate(['/admin/settings']);
  }

  public viewElectionResults(electionId: number): void {
    this.router.navigate(['/admin/results', electionId]);
  }
}
