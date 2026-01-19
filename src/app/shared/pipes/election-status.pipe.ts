import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to transform election status codes into user-friendly labels/keys.
 * Usage: {{ status | electionStatus }}
 */
@Pipe({
    name: 'electionStatus',
    standalone: true
})
export class ElectionStatusPipe implements PipeTransform {

    /**
     * Transforms the status code.
     * @param value The status code (e.g., 'DRAFT', 'ACTIVE').
     * @returns A string representing the translation key or formatted label.
     */
    transform(value: string | undefined | null): string {
        if (!value) return '';

        // In a real app with ngx-translate, usually we return a key like 'ELECTION.STATUS.ACTIVE'
        // For now, let's map to a readable string or a key format.
        const statusMap: { [key: string]: string } = {
            'DRAFT': 'Draft',
            'ACTIVE': 'Active',
            'CLOSED': 'Closed',
            'CANCELLED': 'Cancelled',
            'COMPLETED': 'Completed'
        };

        return statusMap[value.toUpperCase()] || value;
    }
}
