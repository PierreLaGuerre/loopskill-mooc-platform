import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MOCK_INTERESTS } from '../../../core/mocks/mock-interests';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-interests-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interests-onboarding.component.html',
  styleUrl: './interests-onboarding.component.scss'
})
export class InterestsOnboardingComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  availableInterests: string[] = MOCK_INTERESTS;
  selectedInterests: string[] = [];
  errorMessage: string = '';

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
    this.authService.updateCurrentUserInterests(this.selectedInterests);
    this.router.navigateByUrl('/home');
  }

  skip(): void {
    this.router.navigateByUrl('/home');
  }
}