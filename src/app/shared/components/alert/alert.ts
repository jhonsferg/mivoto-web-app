import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './alert.html',
    styleUrl: './alert.scss'
})
export class AlertComponent {
    type = input<AlertType>('info');
    title = input<string>('');
    dismissible = input<boolean>(false);

    visible = signal(true);

    dismiss() {
        this.visible.set(false);
    }
}
