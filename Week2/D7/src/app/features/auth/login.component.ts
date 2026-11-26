import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly authService = inject(AuthService);

  // Signal to toggle password visibility
  readonly showPassword = signal<boolean>(false);

  // Strongly typed Reactive Form with auto-filled default credentials
  readonly loginForm = this.fb.group({
    email: ['sakshi.khankar@edusphere.com', [Validators.required, Validators.email]],
    password: ['Password123!', [Validators.required, Validators.minLength(6)]],
    rememberMe: [true],
  });

  // Getter helpers for template validation states
  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  /**
   * Toggle between password and plain text display
   */
  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  /**
   * Submit login form
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.loginForm.getRawValue();
    if (email && password) {
      this.authService.login({
        email,
        password,
        rememberMe: Boolean(rememberMe),
      });
    }
  }
}
