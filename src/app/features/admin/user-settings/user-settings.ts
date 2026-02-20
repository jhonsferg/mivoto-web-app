import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { SessionService } from '@core/services/session.service';
import { DialogService } from '@core/services/dialog.service';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.scss',
})
export class UserSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);
  private readonly dialog = inject(DialogService);

  public currentUser = signal<User | null>(null);
  public isLoadingProfile = signal(true);
  public isChangingPassword = signal(false);

  public passwordForm = this.fb.group(
    {
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator },
  );

  public ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.isLoadingProfile.set(true);
    this.authService.me().subscribe({
      next: (response) => {
        this.currentUser.set(response.data);
        this.isLoadingProfile.set(false);
      },
      error: (error) => {
        this.isLoadingProfile.set(false);
        console.error('Error loading user profile:', error);
      },
    });
  }

  private passwordMatchValidator(formGroup: any) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  public changePassword(): void {
    if (this.passwordForm.valid) {
      this.isChangingPassword.set(true);

      const request = {
        currentPassword: this.passwordForm.value.oldPassword!,
        newPassword: this.passwordForm.value.newPassword!,
        confirmPassword: this.passwordForm.value.confirmPassword!,
      };

      this.authService.changePassword(request).subscribe({
        next: () => {
          this.isChangingPassword.set(false);
          this.dialog.success('Éxito', 'Contraseña actualizada correctamente');
          this.passwordForm.reset();
        },
        error: (error) => {
          this.isChangingPassword.set(false);
          this.dialog.error(
            'Error',
            error.error?.message || 'No se pudo actualizar la contraseña',
          );
          console.error('Error changing password:', error);
        },
      });
    }
  }

  public getRoleLabel(role: string): string {
    const roles: { [key: string]: string } = {
      VOTER: 'Votante',
      ADMIN: 'Administrador',
      SUPERVISOR: 'Supervisor',
      AUDITOR: 'Auditor',
    };
    return roles[role] || role;
  }
}
