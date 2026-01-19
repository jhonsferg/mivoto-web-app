import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to transform user role codes into readable labels.
 * Usage: {{ role | roleLabel }}
 */
@Pipe({
    name: 'roleLabel',
    standalone: true
})
export class RoleLabelPipe implements PipeTransform {

    /**
     * Transforms the role code.
     * @param value The role code (e.g., 'ROLE_ADMIN').
     * @returns The human-readable role name.
     */
    transform(value: string | undefined | null): string {
        if (!value) return '';

        const roleMap: { [key: string]: string } = {
            'ROLE_ADMIN': 'Administrator',
            'ROLE_VOTER': 'Voter',
            'ROLE_AUDITOR': 'Auditor',
            'ROLE_CANDIDATE': 'Candidate'
        };

        return roleMap[value] || value;
    }
}
