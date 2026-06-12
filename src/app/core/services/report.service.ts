import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ReportService {
    private api = inject(ApiService);
    private BASE_URL = "reports";

    public exportElectionResult(electionId: string): Observable<any> {
        return this.api.get(`${this.BASE_URL}/elections/${electionId}/results`);
    }

    public exportAuditReport(startDate: string, endDate: string): Observable<any> {
        return this.api.get(`${this.BASE_URL}/audit`, new HttpParams({fromObject: {startDate, endDate}}), 'blob');
    }

    public exportSystemStatistics() {
        return this.api.get(`${this.BASE_URL}/statistics`);
    }
}
