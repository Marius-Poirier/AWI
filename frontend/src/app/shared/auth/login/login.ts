import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Local component state
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  // Reactive form
  protected readonly loginForm = this.fb.nonNullable.group({
    login: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Veuillez remplir tous les champs correctement');
      return;
    }

    const { login, password } = this.loginForm.getRawValue();
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.login(login, password);

    // Subscribe to auth state changes to detect success/error
    const authStateEffect = effect(() => {
        if (!this.authService.isLoading()) {
          this.isSubmitting.set(false);

          if (this.authService.isLoggedIn()) {
            this.router.navigate(['/home']);
            authStateEffect.destroy(); // Clean up
          } else if (this.authService.error()) {
            this.errorMessage.set(this.authService.error());
            authStateEffect.destroy(); // Clean up
          }
        }
      });

    // Timeout after 10 seconds
    setTimeout(() => {
      if (this.isSubmitting()) {
        authStateEffect.destroy();
        this.isSubmitting.set(false);
        this.errorMessage.set('Le serveur met trop de temps à répondre');
      }
    }, 10000);
  }

  protected get loginControl() {
    return this.loginForm.controls.login;
  }

  protected get passwordControl() {
    return this.loginForm.controls.password;
  }
}