import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { AppUser } from '../../../shared/interfaces/user';

function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const rePassword = control.get('rePassword')?.value;

  return password === rePassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  errorMessage = '';
  isSubmitting = false;

  form = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', [Validators.required]],
    },
    {
      validators: [passwordMatchValidator],
    },
  );

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    const { username, email, password } = this.form.getRawValue();

    try {
      const credentials = await this.authService.register(email, password);

      const userData: AppUser = {
        uid: credentials.user.uid,
        email: credentials.user.email ?? email,
        username,
        profileImageUrl: '',
        createdAt: new Date().toISOString(),
        posts: [],
      };
      await this.userService.createUser(userData);

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
        case 'auth/email-already-in-use':
          return 'The email address is already in use.';
        case 'auth/invalid-email':
          return 'The email address is not valid.';
        case 'auth/weak-password':
          return 'The password is too weak. It should be at least 6 characters.';
        case 'auth/network-request-failed':
          return 'Network error. Please check your internet connection and try again.';
        default:
          return 'Registration failed. Please try again later.';
      }
    }
    return 'An unexpected error occurred. Please try again later.';
  }
}
