import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MOCK_INTERESTS } from '../../core/mocks/mock-interests';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  mode: 'login' | 'register' = 'login';
  errorMessage: string = '';

  availableInterests: string[] = MOCK_INTERESTS;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    clientType: ['profesional', [Validators.required]],
    interests: [[] as string[]]
  });

  setMode(mode: 'login' | 'register'): void {
    this.mode = mode;
    this.errorMessage = '';
  }

  toggleInterest(interest: string): void {
    const currentInterests = this.registerForm.value.interests ?? [];
    const alreadySelected = currentInterests.includes(interest);

    let updatedInterests: string[];

    if (alreadySelected === true) {
      updatedInterests = currentInterests.filter((item) => item !== interest);
    } else {
      updatedInterests = [...currentInterests, interest];
    }

    this.registerForm.patchValue({
      interests: updatedInterests
    });
  }

  isInterestSelected(interest: string): boolean {
    const currentInterests = this.registerForm.value.interests ?? [];
    return currentInterests.includes(interest);
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    const ok = this.authService.login(email, password);

    if (ok === true) {
      this.errorMessage = '';
      this.router.navigateByUrl('/home');
    } else {
      this.errorMessage = 'Email o contraseña incorrectos.';
    }
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const name = this.registerForm.value.name ?? '';
    const email = this.registerForm.value.email ?? '';
    const password = this.registerForm.value.password ?? '';
    const clientType = this.registerForm.value.clientType ?? 'profesional';
    const interests = this.registerForm.value.interests ?? [];

    const ok = this.authService.register(
      name,
      email,
      password,
      clientType,
      interests
    );

    if (ok === true) {
      this.errorMessage = '';
      this.router.navigateByUrl('/');
    } else {
      this.errorMessage = 'Este email ya está registrado.';
    }
  }
}