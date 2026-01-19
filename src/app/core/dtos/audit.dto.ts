import { AuditAction } from '../enums/audit-action.enum';

/**
 * Data transfer object representing an audit log entry.
 */
export interface AuditLog {
    id: number;
    userId: number;
    action: AuditAction;
    entity: string;
    entityId: number;
    details: string;
    timestamp: string;
    ipAddress: string;
    userAgent: string;
    isCritical: boolean;
}

/**
 * Data transfer object representing an audit report.
 */
export interface AuditReport {
    generatedAt: string;
    totalEvents: number;
    logs: AuditLog[];
    summary: { [action: string]: number };
}
