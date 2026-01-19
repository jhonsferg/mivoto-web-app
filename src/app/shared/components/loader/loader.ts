import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loader.html',
    styleUrl: './loader.scss'
})
export class LoaderComponent {
    size = input<'sm' | 'md' | 'lg'>('md');
    color = input<'primary' | 'white'>('primary');
}
