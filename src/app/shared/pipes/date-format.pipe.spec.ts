import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
    let pipe: DateFormatPipe;

    beforeEach(() => {
        pipe = new DateFormatPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should format a valid date string with default format', () => {
        const dateStr = '2023-10-05';
        // Default format is DD/MM/YYYY
        expect(pipe.transform(dateStr)).toBe('05/10/2023');
    });

    it('should format a valid date object with custom format', () => {
        // Create a date using local time constructor (Year, MonthIndex, Day)
        // Month is 0-indexed (9 = October)
        const date = new Date(2023, 9, 5);
        expect(pipe.transform(date, 'YYYY-MM-DD')).toBe('2023-10-05');
    });

    it('should return empty string for null or undefined', () => {
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });

    it('should return the original string if date is invalid', () => {
        const invalidDate = 'invalid-date';
        expect(pipe.transform(invalidDate)).toBe('invalid-date');
    });
});
