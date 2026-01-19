import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-inputtext',
    standalone: true,
    imports: [],
    templateUrl: './inputtext.html',
    styleUrl: './inputtext.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputtextComponent),
            multi: true
        }
    ]
})
export class InputtextComponent implements ControlValueAccessor {
    label = input<string>('');
    placeholder = input<string>('');
    type = input<string>('text');
    error = input<string>('');
    id = input<string>(`input-${Math.random().toString(36).substr(2, 9)}`);
    required = input<boolean>(false);

    value = '';
    disabled = false;

    // CVA Callbacks
    onChange: (value: string) => void = () => { };
    onTouched: () => void = () => { };

    onInput(event: Event) {
        const val = (event.target as HTMLInputElement).value;
        this.value = val;
        this.onChange(val);
    }

    onBlur() {
        this.onTouched();
    }

    // CVA Implementation
    writeValue(value: string): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
