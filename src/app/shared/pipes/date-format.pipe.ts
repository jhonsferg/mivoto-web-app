import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
    name: 'dateFormat',
    standalone: true
})
export class DateFormatPipe implements PipeTransform {

    transform(value: string | Date | number | null | undefined, format: string = 'DD/MM/YYYY'): string {
        if (!value) {
            return '';
        }

        const date = dayjs(value);

        if (!date.isValid()) {
            return value.toString();
        }

        return date.format(format);
    }

}
