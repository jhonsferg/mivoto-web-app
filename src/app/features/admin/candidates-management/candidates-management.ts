import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CandidateService } from '@core/services/candidate.service';
import { ElectionService } from '@core/services/election.service';
import { DialogService } from '@core/services/dialog.service';
import { CreateCandidateRequest, CandidateDto } from '@core/dtos/candidate.dto';

@Component({
  selector: 'app-candidates-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './candidates-management.html',
  styleUrl: './candidates-management.scss',
})
export class CandidatesManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly candidateService = inject(CandidateService);
  private readonly electionService = inject(ElectionService);
  private readonly dialog = inject(DialogService);

  public elections: any[] = [];
  public candidates: CandidateDto[] = [];
  public selectedElectionId: number | null = null;
  public isLoading = true;
  public showCreateModal = false;
  public showEditModal = false;
  public selectedCandidate: CandidateDto | null = null;

  public candidateForm = this.fb.group({
    electionId: [null as number | null, Validators.required],
    number: [null as number | null, [Validators.required, Validators.min(1)]],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    party: ['', [Validators.maxLength(150)]],
    description: ['', [Validators.maxLength(1000)]],
    photoUrl: ['', [Validators.maxLength(500)]],
  });

  public ngOnInit(): void {
    this.loadElections();

    this.route.queryParams.subscribe((params) => {
      if (params['electionId']) {
        this.selectedElectionId = Number(params['electionId']);
        this.loadCandidates(this.selectedElectionId);
      }
    });
  }

  private loadElections(): void {
    this.electionService.getAllElections().subscribe({
      next: (response) => {
        this.elections = response.data || [];
      },
      error: (error) => {
        console.error('Error loading elections:', error);
      },
    });
  }

  public onElectionChange(electionId: number): void {
    this.selectedElectionId = electionId;
    this.loadCandidates(electionId);
  }

  private loadCandidates(electionId: number): void {
    this.isLoading = true;
    this.candidateService.getCandidatesByElection(electionId).subscribe({
      next: (response) => {
        this.candidates = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dialog.error('Error', 'No se pudieron cargar los candidatos');
        console.error('Error loading candidates:', error);
      },
    });
  }

  public openCreateModal(): void {
    if (!this.selectedElectionId) {
      this.dialog.error('Error', 'Por favor selecciona una elección primero');
      return;
    }

    this.candidateForm.reset({
      electionId: this.selectedElectionId,
      number: null,
      name: '',
      party: '',
      description: '',
      photoUrl: '',
    });
    this.showCreateModal = true;
  }

  public closeCreateModal(): void {
    this.showCreateModal = false;
    this.candidateForm.reset();
  }

  public createCandidate(): void {
    if (this.candidateForm.valid) {
      const request: CreateCandidateRequest = this.candidateForm.value as CreateCandidateRequest;

      this.candidateService.registerCandidate(request).subscribe({
        next: () => {
          this.dialog.success('Éxito', 'Candidato registrado correctamente');
          this.closeCreateModal();
          if (this.selectedElectionId) {
            this.loadCandidates(this.selectedElectionId);
          }
        },
        error: (error) => {
          this.dialog.error('Error', error.error?.message || 'No se pudo registrar el candidato');
          console.error('Error creating candidate:', error);
        },
      });
    }
  }

  public openEditModal(candidate: CandidateDto): void {
    this.selectedCandidate = candidate;
    this.candidateForm.patchValue({
      electionId: candidate.electionId,
      number: candidate.number,
      name: candidate.name,
      party: candidate.party,
      description: candidate.description,
      photoUrl: candidate.photoUrl,
    });
    this.showEditModal = true;
  }

  public closeEditModal(): void {
    this.showEditModal = false;
    this.selectedCandidate = null;
    this.candidateForm.reset();
  }

  public updateCandidate(): void {
    if (this.candidateForm.valid && this.selectedCandidate) {
      const request: CreateCandidateRequest = this.candidateForm.value as CreateCandidateRequest;

      this.candidateService.updateCandidate(this.selectedCandidate.id, request).subscribe({
        next: () => {
          this.dialog.success('Éxito', 'Candidato actualizado correctamente');
          this.closeEditModal();
          if (this.selectedElectionId) {
            this.loadCandidates(this.selectedElectionId);
          }
        },
        error: (error) => {
          this.dialog.error('Error', error.error?.message || 'No se pudo actualizar el candidato');
          console.error('Error updating candidate:', error);
        },
      });
    }
  }

  public toggleCandidateStatus(candidate: CandidateDto): void {
    const action = candidate.active ? 'desactivar' : 'activar';
    this.dialog.confirm('Confirmar', `¿Deseas ${action} este candidato?`).subscribe({
      next: (confirmed) => {
        if (confirmed) {
          const service = candidate.active
            ? this.candidateService.deactivateCandidate(candidate.id)
            : this.candidateService.activateCandidate(candidate.id);

          service.subscribe({
            next: () => {
              this.dialog.success('Éxito', `Candidato ${action}do correctamente`);
              if (this.selectedElectionId) {
                this.loadCandidates(this.selectedElectionId);
              }
            },
            error: (error) => {
              this.dialog.error('Error', error.error?.message || `No se pudo ${action} el candidato`);
            },
          });
        }
      },
    });
  }

  public deleteCandidate(candidate: CandidateDto): void {
    this.dialog
      .confirm(
        'Confirmar Eliminación',
        `¿Estás seguro de eliminar al candidato ${candidate.name}? Esta acción no se puede deshacer.`,
      )
      .subscribe({
        next: (confirmed) => {
          if (confirmed) {
            this.candidateService.deleteCandidate(candidate.id).subscribe({
              next: () => {
                this.dialog.success('Éxito', 'Candidato eliminado correctamente');
                if (this.selectedElectionId) {
                  this.loadCandidates(this.selectedElectionId);
                }
              },
              error: (error) => {
                this.dialog.error(
                  'Error',
                  error.error?.message || 'No se pudo eliminar el candidato',
                );
              },
            });
          }
        },
      });
  }
}
