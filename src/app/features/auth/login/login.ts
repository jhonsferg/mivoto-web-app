import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { ROLES } from '@core/constants/roles.constants';
import { InputtextComponent } from '@shared/components/inputtext/inputtext';
import { InputpasswordComponent } from '@shared/components/inputpassword/inputpassword';
import { BtnComponent } from '@shared/components/btn/btn';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox';
import { DialogService } from '@core/services/dialog.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputtextComponent,
    InputpasswordComponent,
    BtnComponent,
    CheckboxComponent,
    TranslateModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);
  private readonly translate = inject(TranslateService);

  private dialogSubscription: Subscription | null = null;

  public readonly loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  public isLoading = signal(false);

  public ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }

  public onSubmit(): void {
    if (this.loginForm.valid) {
      // Cancel any existing dialog interaction to prevent stale state updates
      if (this.dialogSubscription) {
        this.dialogSubscription.unsubscribe();
        this.dialogSubscription = null;
      }

      this.isLoading.set(true);

      const { username, password } = this.loginForm.value;

      this.auth.login({ username: username!, password: password! }).subscribe({
        next: (data) => {
          this.isLoading.set(false);
          if (data.user.role === ROLES.ADMIN) {
            this.router.navigate(['/', APP_ROUTES.ADMIN]);
          } else {
            this.router.navigate(['/', APP_ROUTES.VOTING]);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Login error', err);
          this.dialogSubscription = this.dialog.error(
            this.translate.instant('AUTH.LOGIN.ERROR.TITLE'),
            this.translate.instant('AUTH.LOGIN.ERROR.MESSAGE')
          ).subscribe();
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
