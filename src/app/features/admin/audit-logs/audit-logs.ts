import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '@core/services/audit.service';
import { DialogService } from '@core/services/dialog.service';
import { AuditAction } from '@core/enums/audit-action.enum';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.scss',
})
export class AuditLogsComponent implements OnInit {
  private readonly auditService = inject(AuditService);
  private readonly dialog = inject(DialogService);

  public logs: any[] = [];
  public isLoading = true;
  public filterType = 'all';
  public startDate = '';
  public endDate = '';
  public selectedAction = '';

  public actions = [
    { value: 'LOGIN', label: 'Inicio de Sesión' },
    { value: 'LOGOUT', label: 'Cierre de Sesión' },
    { value: 'VOTE_CAST', label: 'Voto Emitido' },
    { value: 'VOTE_VERIFIED', label: 'Voto Verificado' },
    { value: 'ELECTION_CREATED', label: 'Elección Creada' },
    { value: 'ELECTION_UPDATED', label: 'Elección Actualizada' },
    { value: 'ELECTION_STARTED', label: 'Elección Iniciada' },
    { value: 'ELECTION_CLOSED', label: 'Elección Cerrada' },
    { value: 'CANDIDATE_ADDED', label: 'Candidato Agregado' },
    { value: 'CANDIDATE_UPDATED', label: 'Candidato Actualizado' },
    { value: 'USER_CREATED', label: 'Usuario Creado' },
    { value: 'USER_UPDATED', label: 'Usuario Actualizado' },
    { value: 'PASSWORD_CHANGED', label: 'Contraseña Cambiada' },
    { value: 'UNAUTHORIZED_ACCESS', label: 'Acceso No Autorizado' },
  ];

  public ngOnInit(): void {
    this.loadLogs();
  }

  private loadLogs(): void {
    this.isLoading = true;

    switch (this.filterType) {
      case 'security':
        this.loadSecurityLogs();
        break;
      case 'voting':
        this.loadVotingLogs();
        break;
      case 'critical':
        this.loadCriticalLogs();
        break;
      case 'action':
        if (this.selectedAction) {
          this.loadLogsByAction();
        } else {
          this.loadAllLogs();
        }
        break;
      case 'dateRange':
        if (this.startDate && this.endDate) {
          this.loadLogsByDateRange();
        } else {
          this.dialog.error('Error', 'Por favor selecciona un rango de fechas');
          this.isLoading = false;
        }
        break;
      default:
        this.loadAllLogs();
    }
  }

  private loadAllLogs(): void {
    this.auditService.getAllAuditLogs().subscribe({
      next: (response) => {
        this.logs = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dialog.error('Error', 'No se pudieron cargar los logs');
        console.error('Error loading logs:', error);
      },
    });
  }

  private loadSecurityLogs(): void {
    this.auditService.getSecurityAuditLogs().subscribe({
      next: (response) => {
        this.logs = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dialog.error('Error', 'No se pudieron cargar los logs de seguridad');
        console.error('Error loading security logs:', error);
      },
    });
  }

  private loadVotingLogs(): void {
    this.auditService.getVotingAuditLogs().subscribe({
      next: (response) => {
        this.logs = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dialog.error('Error', 'No se pudieron cargar los logs de votación');
        console.error('Error loading voting logs:', error);
      },
    });
  }

  private loadCriticalLogs(): void {
    this.auditService.getCriticalAuditLogs().subscribe({
      next: (response) => {
        this.logs = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dialog.error('Error', 'No se pudieron cargar los logs críticos');
        console.error('Error loading critical logs:', error);
      },
    });
  }

  private loadLogsByAction(): void {
    this.auditService.getAuditTrailByAction(this.selectedAction as AuditAction).subscribe({
      next: (response) => {
        this.logs = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dialog.error('Error', 'No se pudieron cargar los logs');
        console.error('Error loading logs by action:', error);
      },
    });
  }

  private loadLogsByDateRange(): void {
    this.auditService.getAuditTrailByDateRange(this.startDate, this.endDate).subscribe({
      next: (response) => {
        this.logs = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.dialog.error('Error', 'No se pudieron cargar los logs');
        console.error('Error loading logs by date range:', error);
      },
    });
  }

  public onFilterChange(): void {
    this.loadLogs();
  }

  public applyFilters(): void {
    this.loadLogs();
  }

  public getActionLabel(action: string): string {
    const actionObj = this.actions.find((a) => a.value === action);
    return actionObj?.label || action;
  }

  public getActionClass(action: string): string {
    if (action.includes('UNAUTHORIZED') || action.includes('FAILED')) {
      return 'critical';
    }
    if (action.includes('VOTE')) {
      return 'voting';
    }
    if (action.includes('ELECTION') || action.includes('CANDIDATE') || action.includes('USER')) {
      return 'admin';
    }
    if (action.includes('LOGIN') || action.includes('LOGOUT') || action.includes('PASSWORD')) {
      return 'security';
    }
    return 'normal';
  }
}
