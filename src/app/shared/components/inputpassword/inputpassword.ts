import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-inputpassword',
    standalone: true,
    imports: [],
    templateUrl: './inputpassword.html',
    styleUrl: './inputpassword.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputpasswordComponent),
            multi: true
        }
    ]
})
export class InputpasswordComponent implements ControlValueAccessor {
    label = input<string>('');
    placeholder = input<string>('');
    error = input<string>('');
    id = input<string>(`input-pwd-${Math.random().toString(36).substr(2, 9)}`);
    required = input<boolean>(false);

    showPassword = signal(false);

    value = '';
    disabled = false;

    // CVA Callbacks
    onChange: (value: string) => void = () => { };
    onTouched: () => void = () => { };

    toggleVisibility() {
        this.showPassword.update(v => !v);
    }

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
