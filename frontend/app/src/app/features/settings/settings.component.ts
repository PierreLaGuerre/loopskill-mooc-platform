import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { User } from '../../core/models/user.model';
import { Course } from '../../core/models/course.model';
import { Plan } from '../../core/models/plan.model';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { PaymentService } from '../../core/services/payment.service';

type SettingsTab = 'account' | 'password' | 'interests' | 'subscription' | 'admin';
type CurrentPlanInfo = {
  id: number;
  name: string;
  price: number;
  description: string;
};

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  @ViewChild('adminCourseForm')
  private adminCourseForm?: ElementRef<HTMLElement>;

  currentUser: User | null = null;
  activeTab: SettingsTab = 'account';

  name: string = '';
  email: string = '';
  clientType: string = '';
  currentPlanName: string = '';
  plans: Plan[] = [];
  adminCategories: { id: number; name: string }[] = [];
  adminTags: { id: number; name: string }[] = [];

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  availableInterests: string[] = [];
  selectedInterests: string[] = [];

  courses: Course[] = [];
  adminMessage: string = '';

  editingCourseId: number | null = null;

  newCourseTitle: string = '';
  newCourseDescription: string = '';
  newCourseCategory: string = 'Programming';
  newCourseLevel: string = 'Beginner';
  newCourseRequiredPlan: string = 'Free';
  newCourseImage: string = 'assets/images/courses/python.png';
  newCourseInstructor: string = '';
  newCourseDurationHours: number = 10;
  newCourseLessonsCount: number = 20;
  newCourseTagsText: string = '';

  accountMessage: string = '';
  passwordMessage: string = '';
  interestsMessage: string = '';
  subscriptionMessage: string = '';
  showUnsubscribeConfirm: boolean = false;

  accountLoading: boolean = false;
  passwordLoading: boolean = false;
  interestsLoading: boolean = false;
  subscriptionLoading: boolean = false;
  adminLoading: boolean = false;

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.authService.getSettings().subscribe({
      next: (settings) => {
        this.currentUser = settings.user;
        this.availableInterests = settings.interests;
        this.plans = settings.plans;
        this.syncUserForm();

        if (this.isAdmin() == true) {
          this.loadAdminData();
        }
      },
      error: () => {
        this.loadCurrentUser();
        this.loadAvailableInterests();
      }
    });
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser != null) {
      this.syncUserForm();
    }
  }

  loadCourses(): void {
    this.adminLoading = true;

    this.courseService.getAdminCourses().subscribe({
      next: (loadedCourses) => {
        this.courses = [...loadedCourses].sort((a, b) => a.title.localeCompare(b.title));
        this.adminLoading = false;
      },
      error: (error) => {
        this.courses = [];
        this.adminLoading = false;
        this.adminMessage = error.status === 403
          ? 'You do not have access to the admin panel.'
          : 'Could not load admin courses.';
      }
    });
  }

  loadAvailableInterests(): void {
    this.authService.getAvailableInterests().subscribe({
      next: (interests) => {
        this.availableInterests = interests;
      },
      error: () => {
        this.availableInterests = [];
        this.interestsMessage = 'Could not load available interests.';
      }
    });
  }

  setActiveTab(tab: SettingsTab): void {
    if (tab === 'admin' && this.isAdmin() == false) {
      return;
    }

    this.activeTab = tab;
    this.clearMessages();
  }

  isAdmin(): boolean {
    if (this.currentUser == null) {
      return false;
    } else {
      return this.currentUser.role === 'admin';
    }
  }

  isEditingCourse(): boolean {
    if (this.editingCourseId == null) {
      return false;
    } else {
      return true;
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

  startEditCourse(course: Course): void {
    this.editingCourseId = course.id;
    this.newCourseTitle = course.title;
    this.newCourseDescription = course.description;
    this.newCourseCategory = course.category;
    this.newCourseLevel = this.toTitleCase(course.level);
    this.newCourseRequiredPlan = course.requiredPlan;
    this.newCourseImage = course.image;
    this.newCourseInstructor = course.instructor;
    this.newCourseDurationHours = course.durationHours;
    this.newCourseLessonsCount = course.lessonsCount;
    this.newCourseTagsText = course.tags.join(', ');
    this.adminMessage = '';
    this.scrollToAdminCourseForm();
  }

  cancelEditCourse(): void {
    this.editingCourseId = null;
    this.resetNewCourseForm();
    this.adminMessage = '';
  }

  saveCourse(): void {
    if (
      this.newCourseTitle.trim() === '' ||
      this.newCourseDescription.trim() === '' ||
      this.newCourseInstructor.trim() === ''
    ) {
      this.adminMessage = 'Please complete title, description and instructor.';
      return;
    }

    const tags = this.newCourseTagsText
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag !== '');

    if (this.isEditingCourse() == true && this.editingCourseId != null) {
      const updatedCourse = this.buildAdminCoursePayload(this.editingCourseId, tags);

      this.adminLoading = true;
      this.courseService.updateCourse(updatedCourse).subscribe({
        next: () => {
          this.adminLoading = false;
          this.editingCourseId = null;
          this.resetNewCourseForm();
          this.loadCourses();
          this.adminMessage = 'Course updated successfully.';
        },
        error: (error) => {
          this.adminLoading = false;
          this.adminMessage = error.error?.message || 'The course could not be updated.';
        }
      });
    } else {
      this.adminLoading = true;
      this.courseService.createCourse(this.buildAdminCoursePayload(null, tags)).subscribe({
        next: () => {
          this.adminLoading = false;
          this.resetNewCourseForm();
          this.loadCourses();
          this.adminMessage = 'Course created successfully.';
        },
        error: (error) => {
          this.adminLoading = false;
          this.adminMessage = error.error?.message || 'The course could not be created.';
        }
      });
    }
  }

  deleteCourse(courseId: number): void {
    const confirmed = confirm('Are you sure you want to delete this course?');

    if (confirmed == false) {
      return;
    }

    this.adminLoading = true;

    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.adminLoading = false;

        if (this.editingCourseId === courseId) {
          this.cancelEditCourse();
        }

        this.adminMessage = 'Course deleted successfully.';
        this.loadCourses();
      },
      error: (error) => {
        this.adminLoading = false;
        this.adminMessage = error.error?.message || 'The course could not be deleted.';
      }
    });
  }

  saveProfile(): void {
    if (this.name.trim() === '' || this.email.trim() === '') {
      this.accountMessage = 'Please complete name and email.';
      return;
    }

    this.accountLoading = true;
    this.accountMessage = '';

    this.authService.updateCurrentUserProfile(this.name, this.email).subscribe({
      next: () => {
        this.accountLoading = false;
        this.accountMessage = 'Your account information has been updated.';
        this.loadSettings();
      },
      error: (error) => {
        this.accountLoading = false;

        if (error.status === 409) {
          this.accountMessage = 'This email is already being used by another account.';
        } else {
          this.accountMessage = error.error?.message || 'Could not update your account.';
        }
      }
    });
  }

  savePassword(): void {
    if (
      this.currentPassword.trim() === '' ||
      this.newPassword.trim() === '' ||
      this.confirmNewPassword.trim() === ''
    ) {
      this.passwordMessage = 'Please complete all password fields.';
      return;
    }

    if (this.newPassword.trim().length < 8) {
      this.passwordMessage = 'The new password must have at least 8 characters.';
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordMessage = 'The new passwords do not match.';
      return;
    }

    this.passwordLoading = true;
    this.passwordMessage = '';

    this.authService
      .updateCurrentUserPassword(this.currentPassword, this.newPassword)
      .subscribe({
        next: () => {
          this.passwordLoading = false;
          this.passwordMessage = 'Your password has been updated.';
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmNewPassword = '';
        },
        error: (error) => {
          this.passwordLoading = false;

          if (error.status === 401) {
            this.passwordMessage = 'Your current password is incorrect.';
          } else {
            this.passwordMessage = error.error?.message || 'Could not update your password.';
          }
        }
      });
  }

  saveInterests(): void {
    this.interestsLoading = true;
    this.interestsMessage = '';

    this.authService.updateCurrentUserInterests(this.selectedInterests).subscribe({
      next: () => {
        this.interestsLoading = false;
        this.interestsMessage = 'Your interests have been updated.';
        this.loadSettings();
      },
      error: (error) => {
        this.interestsLoading = false;
        this.interestsMessage = error.error?.message || 'Could not update your interests.';
      }
    });
  }

  logoutAndRedirect(): void {
    this.authService.logout();
  }

  getCurrentPlanPrice(): string {
    const plan = this.getCurrentPlan();

    if (plan == null || Number(plan.price) === 0) {
      return 'Free';
    }

    return `${Number(plan.price).toFixed(2)} € / month`;
  }

  getNextPaymentDate(): string {
    const nextPaymentDate = new Date();
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

    return nextPaymentDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  hasPaidSubscription(): boolean {
    const plan = this.getCurrentPlan();

    return plan != null && Number(plan.price) > 0;
  }

  changePlan(): void {
    this.router.navigateByUrl('/plans');
  }

  unsubscribe(): void {
    if (this.hasPaidSubscription() == false || this.subscriptionLoading == true) {
      return;
    }

    this.showUnsubscribeConfirm = true;
    this.subscriptionMessage = '';
  }

  confirmUnsubscribe(): void {
    this.subscriptionLoading = true;
    this.subscriptionMessage = '';

    this.paymentService.cancelSubscription().subscribe({
      next: () => {
        this.authService.loadCurrentUserFromToken().subscribe({
          next: () => {
            this.subscriptionLoading = false;
            this.showUnsubscribeConfirm = false;
            this.subscriptionMessage = 'Your subscription has been cancelled. Your account is now on the Free plan.';
            this.loadSettings();
          },
          error: () => {
            this.subscriptionLoading = false;
            this.showUnsubscribeConfirm = false;
            this.subscriptionMessage = 'Your subscription has been cancelled.';
            this.loadSettings();
          }
        });
      },
      error: (error) => {
        this.subscriptionLoading = false;
        this.subscriptionMessage = error.error?.message || 'Could not cancel your subscription.';
      }
    });
  }

  private resetNewCourseForm(): void {
    this.newCourseTitle = '';
    this.newCourseDescription = '';
    this.newCourseCategory = 'Programming';
    this.newCourseLevel = 'Beginner';
    this.newCourseRequiredPlan = 'Free';
    this.newCourseImage = 'assets/images/courses/python.png';
    this.newCourseInstructor = '';
    this.newCourseDurationHours = 10;
    this.newCourseLessonsCount = 20;
    this.newCourseTagsText = '';
  }

  private clearMessages(): void {
    this.accountMessage = '';
    this.passwordMessage = '';
    this.interestsMessage = '';
    this.subscriptionMessage = '';
    this.adminMessage = '';
  }

  private getCurrentPlan(): CurrentPlanInfo | null {
    if (this.currentUser == null) {
      return null;
    }

    return this.plans.find((plan) => plan.id === this.currentUser!.planId)
      ?? this.currentUser.plan
      ?? null;
  }

  private syncUserForm(): void {
    if (this.currentUser == null) {
      return;
    }

    this.name = this.currentUser.name;
    this.email = this.currentUser.email;
    this.clientType = this.currentUser.clientType;
    this.selectedInterests = [...this.currentUser.interests];
    this.currentPlanName = this.currentUser.plan?.name
      ?? this.plans.find((plan) => plan.id === this.currentUser!.planId)?.name
      ?? '';

    if (this.isAdmin() == false && this.activeTab === 'admin') {
      this.activeTab = 'account';
    }
  }

  private loadAdminData(): void {
    this.loadCourses();

    this.courseService.getAdminCategories().subscribe({
      next: (categories) => {
        this.adminCategories = categories;
      },
      error: () => {
        this.adminCategories = [];
      }
    });

    this.courseService.getAdminTags().subscribe({
      next: (tags) => {
        this.adminTags = tags;
      },
      error: () => {
        this.adminTags = [];
      }
    });
  }

  private buildAdminCoursePayload(courseId: number | null, tags: string[]): Course {
    return {
      id: courseId ?? 0,
      title: this.newCourseTitle.trim(),
      shortDescription: this.newCourseDescription.trim(),
      description: this.newCourseDescription.trim(),
      category: this.newCourseCategory,
      level: this.newCourseLevel.toLowerCase(),
      requiredPlanId: this.getPlanIdByName(this.newCourseRequiredPlan),
      requiredPlan: this.newCourseRequiredPlan,
      image: this.newCourseImage.trim(),
      tags: tags,
      isPopular: false,
      instructor: this.newCourseInstructor.trim(),
      durationHours: this.newCourseDurationHours,
      lessonsCount: this.newCourseLessonsCount
    };
  }

  private getPlanIdByName(planName: string): number {
    return this.plans.find((plan) => plan.name === planName)?.id ?? 1;
  }

  private toTitleCase(value: string): string {
    const normalizedValue = value.trim().toLowerCase();

    return normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1);
  }

  private scrollToAdminCourseForm(): void {
    window.setTimeout(() => {
      this.adminCourseForm?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }
}
