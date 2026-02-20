import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ElectionService } from '@core/services/election.service';
import { StatisticsService } from '@core/services/statistics.service';
import { SystemStatistics } from '@core/dtos/statistics.dto';
import { Election } from '@core/models/election.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly electionService = inject(ElectionService);
  private readonly statisticsService = inject(StatisticsService);

  public readonly systemStats = signal<SystemStatistics | null>(null);
  public readonly recentElections = signal<Election[]>([]);
  public readonly isLoading = signal(true);

  public ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading.set(true);

    this.statisticsService.getSystemStatistics().subscribe({
      next: (response) => {
        this.systemStats.set(response.data);
      },
      error: (error) => {
        console.error('Error loading system stats:', error);
      },
    });

    this.electionService.getAllElections().subscribe({
      next: (response) => {
        this.recentElections.set((response.data || []).slice(0, 5));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading elections:', error);
        this.isLoading.set(false);
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
