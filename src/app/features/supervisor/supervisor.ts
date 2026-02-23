import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '@core/services/session.service';
import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'app-supervisor',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './supervisor.html',
    styleUrl: './supervisor.scss',
})
export class SupervisorComponent {
    protected readonly session = inject(SessionService);
    private readonly auth = inject(AuthService);

    public logout(): void {
        this.auth.logout();
    }
}
