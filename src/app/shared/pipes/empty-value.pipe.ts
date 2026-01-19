import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to display a fallback string when the value is empty, null, or undefined.
 * Usage: {{ user.bio | emptyValue:'No bio provided' }}
 */
@Pipe({
    name: 'emptyValue',
    standalone: true
})
export class EmptyValuePipe implements PipeTransform {

    /**
     * Transforms the value, returning the fallback if empty.
     * @param value The value to check.
     * @param fallback The string to display if value is empty (default: '-').
     * @returns The value or the fallback string.
     */
    transform(value: any, fallback: string = '-'): string {
        return (value === null || value === undefined || value === '') ? fallback : value;
    }
}
