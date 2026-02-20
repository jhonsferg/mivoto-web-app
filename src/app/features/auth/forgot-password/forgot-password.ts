import { Component, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputtextComponent } from '@shared/components/inputtext/inputtext';
import { BtnComponent } from '@shared/components/btn/btn';
import { AlertComponent } from '@shared/components/alert/alert';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        InputtextComponent,
        BtnComponent,
        AlertComponent,
        TranslateModule
    ],
    templateUrl: './forgot-password.html',
    styleUrl: './forgot-password.scss'
})
export class ForgotPasswordComponent {
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);

    public readonly forgotForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    public isLoading = signal(false);
    public error = signal('');
    public successMessage = signal('');

    public onSubmit(): void {
        if (this.forgotForm.valid) {
            this.isLoading.set(true);
            this.error.set('');

            // Simulate API call
            setTimeout(() => {
                this.isLoading.set(false);
                this.successMessage.set(this.translate.instant('AUTH.FORGOT_PASSWORD.SUCCESS_MESSAGE'));
            }, 1500);

        } else {
            this.forgotForm.markAllAsTouched();
        }
    }
}
