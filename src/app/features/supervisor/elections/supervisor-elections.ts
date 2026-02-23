import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ElectionService } from '@core/services/election.service';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-supervisor-elections',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './supervisor-elections.html',
  styleUrl: './supervisor-elections.scss',
})
export class SupervisorElectionsComponent implements OnInit {
  private readonly electionService = inject(ElectionService);
  private readonly dialog = inject(DialogService);
  private readonly router = inject(Router);

  public elections = signal<any[]>([]);
  public isLoading = signal(true);

  public ngOnInit(): void {
    this.loadElections();
  }

  private loadElections(): void {
    this.isLoading.set(true);
    this.electionService.getAllElections().subscribe({
      next: (response) => {
        this.elections.set(response.data || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.dialog.error('Error', 'No se pudieron cargar las elecciones');
      },
    });
  }

  public viewResults(id: number): void {
    this.router.navigate(['/supervisor/results', id]);
  }

  public getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      DRAFT: 'draft',
      SCHEDULED: 'scheduled',
      ACTIVE: 'active',
      CLOSED: 'closed',
      CANCELLED: 'cancelled',
    };
    return statusMap[status] || 'draft';
  }

  public getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      DRAFT: 'Borrador',
      SCHEDULED: 'Programada',
      ACTIVE: 'Activa',
      CLOSED: 'Cerrada',
      CANCELLED: 'Cancelada',
    };
    return labels[status] || status;
  }
}
