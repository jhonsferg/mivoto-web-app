import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-checkbox',
    standalone: true,
    templateUrl: './checkbox.html',
    styleUrl: './checkbox.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true
        }
    ]
})
export class CheckboxComponent implements ControlValueAccessor {
    checked = false;
    disabled = false;

    private onChangeFn: (value: boolean) => void = () => { };
    onTouched: () => void = () => { };

    onChange(event: Event) {
        this.checked = (event.target as HTMLInputElement).checked;
        this.onChangeFn(this.checked);
    }

    writeValue(value: boolean): void {
        this.checked = value;
    }

    registerOnChange(fn: any): void {
        this.onChangeFn = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
