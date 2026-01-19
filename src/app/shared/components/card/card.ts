import { Component, input } from '@angular/core';

@Component({
    selector: 'app-card',
    standalone: true,
    templateUrl: './card.html',
    styleUrl: './card.scss'
})
export class CardComponent {
    title = input<string>('');
    subtitle = input<string>('');
}
