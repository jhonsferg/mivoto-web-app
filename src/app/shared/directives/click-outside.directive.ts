import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * Directive to detect clicks outside of the host element.
 * Usage: (appClickOutside)="closeDropdown()"
 */
@Directive({
    selector: '[appClickOutside]',
    standalone: true
})
export class ClickOutsideDirective {
    @Output() appClickOutside = new EventEmitter<void>();

    constructor(private elementRef: ElementRef) { }

    @HostListener('document:click', ['$event.target'])
    public onClick(target: any): void {
        const clickedInside = this.elementRef.nativeElement.contains(target);
        if (!clickedInside) {
            this.appClickOutside.emit();
        }
    }
}
