import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '@core/services/session.service';
import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './admin.html',
    styleUrl: './admin.scss',
})
export class AdminComponent {
    protected readonly session = inject(SessionService);
    private readonly auth = inject(AuthService);

    public logout(): void {
        this.auth.logout();
    }
}
