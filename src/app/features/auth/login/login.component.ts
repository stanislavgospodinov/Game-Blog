import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  isSubmitting = false;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.isSubmitting = true;

    const { email, password } = this.form.getRawValue();

    try {
      await this.authService.login(email, password);
      this.router.navigate(['/']);
    } catch (error: unknown) {
      this.errorMessage = this.getFirebaseErrorMessage(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private getFirebaseErrorMessage(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'string'
    ) {
      switch (error.code) {
        case 'auth/invalid-credentials':
          return 'Invalid email or password.';
        case 'auth/too-many-requests':
          return 'Too many failed login attempts. Please try again later.';
        case 'auth/network-request-failed':
          return 'Network error. Please check your connection and try again.';
        default:
          return 'Login failed. Please try again.';
      }
    }

    return 'An unexpected error occurred. Please try again.';
  }
}
