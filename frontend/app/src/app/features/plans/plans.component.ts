import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Plan } from '../../core/models/plan.model';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss'
})
export class PlansComponent implements OnInit {
  private authService = inject(AuthService);

  plans: Plan[] = [];
  currentUser: User | null = null;
  currentPlanId: number | null = null;
  upgradeMessage: string = '';
  isLoading: boolean = true;
  isUpdatingPlan: boolean = false;

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadPlans();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser != null) {
      this.currentPlanId = this.currentUser.planId;
    } else {
      this.currentPlanId = null;
    }
  }

  isCurrentPlan(planId: number): boolean {
    if (this.currentPlanId == null) {
      return false;
    } else {
      return this.currentPlanId === planId;
    }
  }

  canUpgradeTo(planId: number): boolean {
    if (this.currentPlanId == null) {
      return false;
    } else {
      return planId > this.currentPlanId;
    }
  }

  upgradePlan(planId: number): void {
    if (this.canUpgradeTo(planId) == false || this.isUpdatingPlan == true) {
      return;
    }

    this.isUpdatingPlan = true;
    this.upgradeMessage = '';

    this.authService.updateCurrentUserPlan(planId).subscribe({
      next: () => {
        this.isUpdatingPlan = false;
        this.loadCurrentUser();

        const updatedPlan = this.plans.find(function(plan: Plan): boolean {
          return plan.id === planId;
        });

        if (updatedPlan != null) {
          this.upgradeMessage = `Your plan has been updated to ${updatedPlan.name}.`;
        } else {
          this.upgradeMessage = 'Your plan has been updated.';
        }
      },
      error: (error) => {
        this.isUpdatingPlan = false;
        this.upgradeMessage = error.error?.message || 'Could not update your plan.';
      }
    });
  }

  getPlanButtonLabel(planId: number): string {
    const plan = this.plans.find(function(item: Plan): boolean {
      return item.id === planId;
    });

    if (this.isCurrentPlan(planId) == true) {
      return 'Current plan';
    } else if (this.canUpgradeTo(planId) == true && plan != null) {
      return `Upgrade to ${plan.name}`;
    } else {
      return 'Not available';
    }
  }

  getCurrentPlanName(): string {
    return this.plans.find((plan) => plan.id === this.currentPlanId)?.name ?? '';
  }

  private loadPlans(): void {
    this.isLoading = true;

    this.authService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.isLoading = false;
      },
      error: () => {
        this.plans = [];
        this.isLoading = false;
        this.upgradeMessage = 'Could not load plans.';
      }
    });
  }
}
