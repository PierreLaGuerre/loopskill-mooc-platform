import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ClientType } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  mode: 'login' | 'register' = 'login';
  errorMessage: string = '';
  isLoading: boolean = false;

  availableInterests: string[] = [];

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    clientType: ['professional', [Validators.required]],
    interests: [[] as string[]]
  });

  ngOnInit(): void {
    this.loadAvailableInterests();
  }

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

    this.isLoading = true;
    this.errorMessage = '';

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = this.getAuthErrorMessage(error);
      }
    });
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const name = this.registerForm.value.name ?? '';
    const email = this.registerForm.value.email ?? '';
    const password = this.registerForm.value.password ?? '';
    const clientType = (this.registerForm.value.clientType ?? 'professional') as ClientType;
    const interests = this.registerForm.value.interests ?? [];

    this.authService.register(name, email, password, clientType, interests).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl('/onboarding/interests');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = this.getAuthErrorMessage(error);
      }
    });
  }

  private loadAvailableInterests(): void {
    this.authService.getAvailableInterests().subscribe({
      next: (interests) => {
        this.availableInterests = interests;
      },
      error: () => {
        this.availableInterests = [];
      }
    });
  }

  private getAuthErrorMessage(error: any): string {
    if (error.status === 400) {
      return error.error?.message || 'Please check the form data.';
    }

    if (error.status === 401) {
      return 'Invalid email or password.';
    }

    if (error.status === 409) {
      return 'This email is already registered.';
    }

    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }

    return 'Something went wrong. Please try again.';
  }
}