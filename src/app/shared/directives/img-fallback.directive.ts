import { Directive, Input, ElementRef, HostListener } from '@angular/core';

/**
 * Directive to handle image loading errors by replacing the src with a fallback image.
 * Usage: <img src="avatar.jpg" appImgFallback="assets/images/default-avatar.png">
 */
@Directive({
    selector: 'img[appImgFallback]',
    standalone: true
})
export class ImgFallbackDirective {
    @Input() appImgFallback: string = '';

    constructor(private el: ElementRef) { }

    @HostListener('error')
    onError() {
        if (this.appImgFallback) {
            this.el.nativeElement.src = this.appImgFallback;
        } else {
            // Default transparent pixel or placeholder if none provided
            this.el.nativeElement.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }
    }
}
