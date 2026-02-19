import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ElectionService } from '@core/services/election.service';
import { DialogService } from '@core/services/dialog.service';
import { CreateElectionRequest, UpdateElectionRequest } from '@core/dtos/election.dto';

@Component({
  selector: 'app-elections-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './elections-management.html',
  styleUrl: './elections-management.scss',
})
export class ElectionsManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly electionService = inject(ElectionService);
  private readonly dialog = inject(DialogService);
  private readonly router = inject(Router);

  public elections: any[] = [];
  public isLoading = true;
  public showCreateModal = false;
  public showEditModal = false;
  public selectedElection: any = null;

  public electionForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(1000)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    maxVotesPerUser: [1, [Validators.required, Validators.min(1)]],
    allowsBlankVote: [false],
    requiresVerification: [false],
  });

  public ngOnInit(): void {
    this.loadElections();
  }

  private loadElections(): void {
    this.isLoading = true;
    this.electionService.getAllElections().subscribe({
      next: (response) => {
        this.elections = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dialog.error('Error', 'No se pudieron cargar las elecciones');
        console.error('Error loading elections:', error);
      },
    });
  }

  public openCreateModal(): void {
    this.electionForm.reset({
      maxVotesPerUser: 1,
      allowsBlankVote: false,
      requiresVerification: false,
    });
    this.showCreateModal = true;
  }

  public closeCreateModal(): void {
    this.showCreateModal = false;
    this.electionForm.reset();
  }

  public createElection(): void {
    if (this.electionForm.valid) {
      const request: CreateElectionRequest = this.electionForm.value as CreateElectionRequest;

      this.electionService.createElection(request).subscribe({
        next: () => {
          this.dialog.success('Éxito', 'Elección creada correctamente');
          this.closeCreateModal();
          this.loadElections();
        },
        error: (error) => {
          this.dialog.error('Error', error.error?.message || 'No se pudo crear la elección');
          console.error('Error creating election:', error);
        },
      });
    }
  }

  public openEditModal(election: any): void {
    this.selectedElection = election;
    this.electionForm.patchValue({
      title: election.title,
      description: election.description,
      startDate: this.formatDateForInput(election.startDate),
      endDate: this.formatDateForInput(election.endDate),
    });
    this.showEditModal = true;
  }

  public closeEditModal(): void {
    this.showEditModal = false;
    this.selectedElection = null;
    this.electionForm.reset();
  }

  public updateElection(): void {
    if (this.electionForm.valid && this.selectedElection) {
      const request: UpdateElectionRequest = {
        title: this.electionForm.value.title!,
        description: this.electionForm.value.description!,
        startDate: this.electionForm.value.startDate!,
        endDate: this.electionForm.value.endDate!,
      };

      this.electionService.updateElection(this.selectedElection.id, request).subscribe({
        next: () => {
          this.dialog.success('Éxito', 'Elección actualizada correctamente');
          this.closeEditModal();
          this.loadElections();
        },
        error: (error) => {
          this.dialog.error('Error', error.error?.message || 'No se pudo actualizar la elección');
          console.error('Error updating election:', error);
        },
      });
    }
  }

  public startElection(id: number): void {
    this.dialog.confirm('Confirmar', '¿Deseas iniciar esta elección?').subscribe({
      next: (confirmed) => {
        if (confirmed) {
          this.electionService.startElection(id).subscribe({
            next: () => {
              this.dialog.success('Éxito', 'Elección iniciada correctamente');
              this.loadElections();
            },
            error: (error) => {
              this.dialog.error('Error', error.error?.message || 'No se pudo iniciar la elección');
            },
          });
        }
      },
    });
  }

  public closeElection(id: number): void {
    this.dialog.confirm('Confirmar', '¿Deseas cerrar esta elección?').subscribe({
      next: (confirmed) => {
        if (confirmed) {
          this.electionService.closeElection(id).subscribe({
            next: () => {
              this.dialog.success('Éxito', 'Elección cerrada correctamente');
              this.loadElections();
            },
            error: (error) => {
              this.dialog.error('Error', error.error?.message || 'No se pudo cerrar la elección');
            },
          });
        }
      },
    });
  }

  public cancelElection(id: number): void {
    this.dialog.confirm('Confirmar', '¿Deseas cancelar esta elección? Esta acción no se puede deshacer.').subscribe({
      next: (confirmed) => {
        if (confirmed) {
          this.electionService.cancelElection(id, 'Cancelada por el administrador').subscribe({
            next: () => {
              this.dialog.success('Éxito', 'Elección cancelada correctamente');
              this.loadElections();
            },
            error: (error) => {
              this.dialog.error('Error', error.error?.message || 'No se pudo cancelar la elección');
            },
          });
        }
      },
    });
  }

  public viewResults(id: number): void {
    this.router.navigate(['/admin/results', id]);
  }

  public manageCandidates(electionId: number): void {
    this.router.navigate(['/admin/candidates'], { queryParams: { electionId } });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
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
