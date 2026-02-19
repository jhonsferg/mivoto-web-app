import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ElectionService } from '@core/services/election.service';
import { Election } from '@core/models/election.model';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-elections-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './elections-list.html',
  styleUrl: './elections-list.scss',
})
export class ElectionsListComponent implements OnInit {
  private readonly electionService = inject(ElectionService);
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);

  public elections: Election[] = [];
  public isLoading = true;
  public errorMessage = '';

  public ngOnInit(): void {
    this.loadActiveElections();
  }

  private loadActiveElections(): void {
    this.isLoading = true;
    this.electionService.getActiveElections().subscribe({
      next: (response) => {
        this.elections = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las elecciones activas';
        this.isLoading = false;
        this.dialog.error('Error', this.errorMessage);
        console.error('Error loading elections:', error);
      },
    });
  }

  public viewElectionDetails(electionId: number): void {
    this.router.navigate(['/voting/election', electionId]);
  }

  public getElectionStatus(election: Election): string {
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (now < startDate) {
      return 'Próximamente';
    } else if (now > endDate) {
      return 'Finalizada';
    } else {
      return 'En curso';
    }
  }

  public isElectionActive(election: Election): boolean {
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);
    return now >= startDate && now <= endDate;
  }
}
