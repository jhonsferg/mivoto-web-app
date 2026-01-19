import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { SessionService } from '@core/services/session.service';

/**
 * Structural directive to conditionally show elements based on user roles.
 * Usage: *appHasRole="['ROLE_ADMIN', 'ROLE_AUDITOR']"
 */
@Directive({
    selector: '[appHasRole]',
    standalone: true
})
export class HasRoleDirective {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private sessionService = inject(SessionService);

    private requiredRoles: string[] = [];
    private isViewCreated = false;

    constructor() {
        // Reactively check permissions when the user role changes
        effect(() => {
            const userRole = this.sessionService.userRole();
            this.updateView(userRole);
        });
    }

    /**
     * Sets the required roles for this element.
     * @param roles Single role string or array of role strings.
     */
    @Input()
    set appHasRole(roles: string[] | string) {
        this.requiredRoles = Array.isArray(roles) ? roles : [roles];
        this.updateView(this.sessionService.userRole());
    }

    private updateView(userRole: string | undefined | null): void {
        const hasPermission = userRole && this.requiredRoles.includes(userRole);

        if (hasPermission && !this.isViewCreated) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.isViewCreated = true;
        } else if (!hasPermission && this.isViewCreated) {
            this.viewContainer.clear();
            this.isViewCreated = false;
        }
    }
}
