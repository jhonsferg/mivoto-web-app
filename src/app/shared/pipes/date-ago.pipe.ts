import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to display dates as relative time (e.g., "5 minutes ago").
 * Usage: {{ createdDate | dateAgo }}
 */
@Pipe({
    name: 'dateAgo',
    standalone: true
})
export class DateAgoPipe implements PipeTransform {

    /**
     * Transforms a date into a relative time string.
     * @param value The date to transform.
     * @returns The relative time string.
     */
    transform(value: string | Date | undefined | null): string {
        if (!value) return '';

        const date = new Date(value);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 29) return 'Just now';

        const intervals: { [key: string]: number } = {
            'year': 31536000,
            'month': 2592000,
            'week': 604800,
            'day': 86400,
            'hour': 3600,
            'minute': 60,
            'second': 1
        };

        let counter;
        for (const i in intervals) {
            counter = Math.floor(seconds / intervals[i]);
            if (counter > 0)
                if (counter === 1) {
                    return counter + ' ' + i + ' ago';
                } else {
                    return counter + ' ' + i + 's ago';
                }
        }
        return value.toString();
    }
}
