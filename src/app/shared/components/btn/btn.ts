import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BtnVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type BtnSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-btn',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './btn.html',
    styleUrl: './btn.scss'
})
export class BtnComponent {
    variant = input<BtnVariant>('primary');
    size = input<BtnSize>('md');
    disabled = input<boolean>(false);
    loading = input<boolean>(false);
    type = input<'button' | 'submit' | 'reset'>('button');

    onClick = output<Event>();

    handleClick(event: Event) {
        if (!this.disabled() && !this.loading()) {
            this.onClick.emit(event);
        } else {
            event.preventDefault();
            event.stopPropagation();
        }
    }
}
