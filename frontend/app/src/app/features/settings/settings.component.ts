import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { MOCK_INTERESTS } from '../../core/mocks/mock-interests';
import { MOCK_PLANS } from '../../core/mocks/mock-plans';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  private authService = inject(AuthService);

  currentUser: User | null = null;

  name: string = '';
  email: string = '';
  clientType: string = '';
  currentPlanName: string = '';

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  availableInterests: string[] = MOCK_INTERESTS;
  selectedInterests: string[] = [];

  accountMessage: string = '';
  passwordMessage: string = '';
  interestsMessage: string = '';

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser != null) {
      this.name = this.currentUser.name;
      this.email = this.currentUser.email;
      this.clientType = this.currentUser.clientType;
      this.selectedInterests = [...this.currentUser.interests];

      const currentPlan = MOCK_PLANS.find((plan) => plan.id === this.currentUser!.planId);

      if (currentPlan != null) {
        this.currentPlanName = currentPlan.name;
      } else {
        this.currentPlanName = '';
      }
    }
  }

  isInterestSelected(interest: string): boolean {
    return this.selectedInterests.includes(interest);
  }

  toggleInterest(interest: string): void {
    if (this.isInterestSelected(interest) == true) {
      this.selectedInterests = this.selectedInterests.filter((item) => item !== interest);
    } else {
      this.selectedInterests = [...this.selectedInterests, interest];
    }

    this.interestsMessage = '';
  }

  saveProfile(): void {
    const ok = this.authService.updateCurrentUserProfile(this.name, this.email);

    if (ok == true) {
      this.accountMessage = 'Your account information has been updated.';
      this.loadCurrentUser();
    } else {
      this.accountMessage = 'This email is already being used by another account.';
    }
  }

  savePassword(): void {
    if (this.newPassword.trim() === '' || this.confirmNewPassword.trim() === '') {
      this.passwordMessage = 'Please complete all password fields.';
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordMessage = 'The new passwords do not match.';
      return;
    }

    const ok = this.authService.updateCurrentUserPassword(
      this.currentPassword,
      this.newPassword
    );

    if (ok == true) {
      this.passwordMessage = 'Your password has been updated.';
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
    } else {
      this.passwordMessage = 'Your current password is incorrect.';
    }
  }

  saveInterests(): void {
    this.authService.updateCurrentUserInterests(this.selectedInterests);
    this.interestsMessage = 'Your interests have been updated.';
    this.loadCurrentUser();
  }
}
