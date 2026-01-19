import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '@shared/components/btn/btn';
import { DialogConfig } from '@core/models/dialog.model';

@Component({
    selector: 'app-dialog',
    standalone: true,
    imports: [CommonModule, BtnComponent],
    templateUrl: './dialog.html',
    styleUrl: './dialog.scss'
})
export class DialogComponent {
    // Config passed dynamically
    @Input() public config: DialogConfig | null = null;

    // Event emitted when dialog should close
    @Output() public readonly closed = new EventEmitter<boolean>();

    // Used to trigger animations or internal state if needed
    public readonly startAnimation = signal(false);

    public close(result: boolean): void {
        this.closed.emit(result);
    }

    public onBackdropClick(): void {
        if (!this.config?.disableClose) {
            this.close(false);
        }
    }
}
