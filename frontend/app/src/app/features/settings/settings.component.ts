import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { User } from '../../core/models/user.model';
import { Course } from '../../core/models/course.model';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { MOCK_PLANS } from '../../core/mocks/mock-plans';

type SettingsTab = 'account' | 'password' | 'interests' | 'admin';

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
  private router = inject(Router);

  currentUser: User | null = null;
  activeTab: SettingsTab = 'account';

  name: string = '';
  email: string = '';
  clientType: string = '';
  currentPlanName: string = '';

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

  accountLoading: boolean = false;
  passwordLoading: boolean = false;
  interestsLoading: boolean = false;

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAvailableInterests();
    this.loadCourses();
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

      if (this.isAdmin() == false && this.activeTab === 'admin') {
        this.activeTab = 'account';
      }
    }
  }

  loadCourses(): void {
    const loadedCourses = this.courseService.getAdminCourses();
    this.courses = [...loadedCourses].sort((a, b) => a.title.localeCompare(b.title));
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
    this.newCourseLevel = course.level;
    this.newCourseRequiredPlan = course.requiredPlan;
    this.newCourseImage = course.image;
    this.newCourseInstructor = course.instructor;
    this.newCourseDurationHours = course.durationHours;
    this.newCourseLessonsCount = course.lessonsCount;
    this.newCourseTagsText = course.tags.join(', ');
    this.adminMessage = '';
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
      const existingCourse = this.courseService.getAdminCourseById(this.editingCourseId);

      if (existingCourse == null) {
        this.adminMessage = 'The selected course could not be found.';
        return;
      }

      const updatedCourse: Course = {
        ...existingCourse,
        title: this.newCourseTitle.trim(),
        description: this.newCourseDescription.trim(),
        category: this.newCourseCategory,
        level: this.newCourseLevel,
        requiredPlan: this.newCourseRequiredPlan,
        image: this.newCourseImage.trim(),
        tags: tags,
        instructor: this.newCourseInstructor.trim(),
        durationHours: this.newCourseDurationHours,
        lessonsCount: this.newCourseLessonsCount
      };

      const ok = this.courseService.updateCourse(updatedCourse);

      if (ok == true) {
        this.editingCourseId = null;
        this.resetNewCourseForm();
        this.loadCourses();
        this.adminMessage = 'Course updated successfully.';
      } else {
        this.adminMessage = 'The course could not be updated.';
      }
    } else {
      this.courseService.createCourse({
        title: this.newCourseTitle.trim(),
        description: this.newCourseDescription.trim(),
        category: this.newCourseCategory,
        level: this.newCourseLevel,
        requiredPlan: this.newCourseRequiredPlan,
        image: this.newCourseImage.trim(),
        tags: tags,
        isPopular: false,
        instructor: this.newCourseInstructor.trim(),
        durationHours: this.newCourseDurationHours,
        lessonsCount: this.newCourseLessonsCount
      });

      this.resetNewCourseForm();
      this.loadCourses();
      this.adminMessage = 'Course created successfully.';
    }
  }

  deleteCourse(courseId: number): void {
    const confirmed = confirm('Are you sure you want to delete this course?');

    if (confirmed == false) {
      return;
    }

    const ok = this.courseService.deleteCourse(courseId);

    if (ok == true) {
      if (this.editingCourseId === courseId) {
        this.cancelEditCourse();
      }

      this.adminMessage = 'Course deleted successfully.';
      this.loadCourses();
    } else {
      this.adminMessage = 'The course could not be deleted.';
    }
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
        this.loadCurrentUser();
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
        this.loadCurrentUser();
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
    this.adminMessage = '';
  }
}
