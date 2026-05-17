import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plan } from '../../core/models/plan.model';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss'
})
export class PlansComponent implements OnInit {
  private authService = inject(AuthService);
  private paymentService = inject(PaymentService);
  private route = inject(ActivatedRoute);

  plans: Plan[] = [];
  currentUser: User | null = null;
  currentPlanId: number | null = null;
  isLoading: boolean = true;
  isUpdatingPlan: boolean = false;

  ngOnInit(): void {
    this.handlePaymentReturn();
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

    this.paymentService.createPlanCheckout(planId).subscribe({
      next: (checkout) => {
        this.paymentService.redirectToCheckout(checkout.checkoutUrl);
      },
      error: () => {
        this.isUpdatingPlan = false;
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
      }
    });
  }

  private handlePaymentReturn(): void {
    const paymentStatus = this.route.snapshot.queryParamMap.get('payment');

    if (paymentStatus === 'success') {
      this.authService.loadCurrentUserFromToken().subscribe({
        next: () => {
          this.loadCurrentUser();
        },
        error: () => {
          this.loadCurrentUser();
        }
      });
    }
  }
}
