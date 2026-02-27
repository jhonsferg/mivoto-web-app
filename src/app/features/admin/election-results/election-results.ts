import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ElectionService } from '@core/services/election.service';
import { DialogService } from '@core/services/dialog.service';
import { SessionService } from '@core/services/session.service';
import { ROLES } from '@core/constants/roles.constants';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { Election } from '@core/models/election.model';
import { ElectionResultsDto, ElectionStatisticsDto } from '@core/dtos/election.dto';

@Component({
  selector: 'app-election-results',
  standalone: true,
  imports: [KeyValuePipe, DatePipe],
  templateUrl: './election-results.html',
  styleUrl: './election-results.scss',
})
export class ElectionResultsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly electionService = inject(ElectionService);
  private readonly dialog = inject(DialogService);
  private readonly session = inject(SessionService);

  public electionResults = signal<ElectionResultsDto | null>(null);
  public statistics = signal<ElectionStatisticsDto | null>(null);
  public electionDetails = signal<Election | null>(null);
  public isLoading = signal(true);
  public isExporting = signal(false);

  public ngOnInit(): void {
    const electionId = Number(this.route.snapshot.paramMap.get('id'));
    if (electionId) {
      this.loadResults(electionId);
      this.loadStatistics(electionId);
      this.loadElectionDetails(electionId);
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

  private loadElectionDetails(electionId: number): void {
    this.electionService.getElectionById(electionId).subscribe({
      next: (response) => {
        this.electionDetails.set(response.data);
      },
      error: (error) => {
        console.error('Error loading election details:', error);
      },
    });
  }

  public goBack(): void {
    if (this.session.userRole() === ROLES.SUPERVISOR) {
      this.router.navigate(['/', APP_ROUTES.SUPERVISOR]);
    } else {
      this.router.navigate(['/', APP_ROUTES.ADMIN]);
    }
  }

  public getPercentageClass(percentage: number | null): string {
    if ((percentage ?? 0) >= 50) return 'high';
    if ((percentage ?? 0) >= 25) return 'medium';
    return 'low';
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

  public exportToExcel(): void {
    const results = this.electionResults();
    const stats = this.statistics();
    const details = this.electionDetails();

    if (!results) return;

    this.isExporting.set(true);

    // Keep the overlay visible for at least 1 s regardless of how fast the
    // synchronous XLSX work finishes. We also yield to the event loop first
    // (50 ms) so Angular can render the overlay before the CPU-heavy work runs.
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 1000));

    const work = new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          const wb = XLSX.utils.book_new();

          // ── Sheet 1: Election information ───────────────────────────────────
          const infoRows: (string | number | null)[][] = [
            ['INFORMACIÓN DE LA ELECCIÓN'],
            [],
            ['Título', results.electionTitle],
            ['Descripción', details?.description ?? '—'],
            ['Estado', details ? this.getStatusLabel(details.status) : '—'],
            ['Fecha de Inicio', details?.startDate ? new Date(details.startDate).toLocaleString('es') : '—'],
            ['Fecha de Cierre', details?.endDate ? new Date(details.endDate).toLocaleString('es') : '—'],
            [],
            ['ESTADÍSTICAS'],
            [],
            ['Total de Votos', results.totalVotes],
            ['Total de Candidatos', stats?.totalCandidates ?? '—'],
            ['Tasa de Participación', stats?.participationRate != null ? `${stats.participationRate.toFixed(2)}%` : '—'],
            ['Candidato Ganador', results.winner || stats?.leadingCandidate?.name || '—'],
            [],
            ['CONFIGURACIÓN'],
            [],
            ['Votos Máximos por Usuario', details?.maxVotesPerUser ?? '—'],
            ['Permite Voto en Blanco', details?.allowsBlankVote ? 'Sí' : 'No'],
            ['Requiere Verificación', details?.requiresVerification ? 'Sí' : 'No'],
          ];
          const infoSheet = XLSX.utils.aoa_to_sheet(infoRows);
          infoSheet['!cols'] = [{ wch: 32 }, { wch: 55 }];
          XLSX.utils.book_append_sheet(wb, infoSheet, 'Información');

          // ── Sheet 2: Results by candidate ────────────────────────────────────
          const candidateRows = [
            ['Posición', 'Candidato', 'Partido', 'Número', 'Votos', 'Porcentaje'],
            ...results.results.map((r, i) => [
              i + 1,
              r.candidateName,
              r.party,
              r.number,
              r.votes,
              parseFloat((r.percentage ?? 0).toFixed(2)),
            ]),
          ];
          const candidateSheet = XLSX.utils.aoa_to_sheet(candidateRows);
          candidateSheet['!cols'] = [
            { wch: 10 },
            { wch: 32 },
            { wch: 28 },
            { wch: 10 },
            { wch: 10 },
            { wch: 14 },
          ];
          XLSX.utils.book_append_sheet(wb, candidateSheet, 'Resultados por Candidato');

          // ── Sheet 3: Results by party ─────────────────────────────────────────
          if (stats?.votesByParty) {
            const totalVotes = results.totalVotes || 1;
            const partyRows = [
              ['Partido', 'Votos', 'Porcentaje'],
              ...Object.entries(stats.votesByParty).map(([party, votes]) => [
                party,
                votes,
                parseFloat(((votes / totalVotes) * 100).toFixed(2)),
              ]),
            ];
            const partySheet = XLSX.utils.aoa_to_sheet(partyRows);
            partySheet['!cols'] = [{ wch: 30 }, { wch: 12 }, { wch: 14 }];
            XLSX.utils.book_append_sheet(wb, partySheet, 'Resultados por Partido');
          }

          const safeName = results.electionTitle
            .replace(/[^a-z0-9\s-]/gi, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
          XLSX.writeFile(wb, `resultados-${safeName}.xlsx`);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 50);
    });

    Promise.all([work, minDelay])
      .catch((error) => {
        console.error('Error exporting to Excel:', error);
        this.dialog.error('Error', 'No se pudo exportar el archivo Excel');
      })
      .finally(() => {
        this.isExporting.set(false);
      });
  }
}
