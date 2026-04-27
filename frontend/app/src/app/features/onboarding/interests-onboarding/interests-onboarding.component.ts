import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-interests-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interests-onboarding.component.html',
  styleUrl: './interests-onboarding.component.scss'
})
export class InterestsOnboardingComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  availableInterests: string[] = [];
  selectedInterests: string[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadAvailableInterests();
  }

  toggleInterest(interest: string): void {
    const alreadySelected = this.selectedInterests.includes(interest);

    if (alreadySelected === true) {
      this.selectedInterests = this.selectedInterests.filter((item) => item !== interest);
    } else {
      this.selectedInterests = [...this.selectedInterests, interest];
    }
  }

  isInterestSelected(interest: string): boolean {
    return this.selectedInterests.includes(interest);
  }

  finishOnboarding(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.updateCurrentUserInterests(this.selectedInterests).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl('/home');
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Could not save your interests. Please try again.';
      }
    });
  }

  skip(): void {
    this.router.navigateByUrl('/home');
  }

  private loadAvailableInterests(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getAvailableInterests().subscribe({
      next: (interests) => {
        this.availableInterests = interests;
        this.isLoading = false;
      },
      error: () => {
        this.availableInterests = [];
        this.isLoading = false;
        this.errorMessage = 'Could not load interests. Please try again.';
      }
    });
  }
}