import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../../core/models/user.model';
import { Course } from '../../core/models/course.model';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { MOCK_INTERESTS } from '../../core/mocks/mock-interests';
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

  currentUser: User | null = null;
  activeTab: SettingsTab = 'account';

  name: string = '';
  email: string = '';
  clientType: string = '';
  currentPlanName: string = '';

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  availableInterests: string[] = MOCK_INTERESTS;
  selectedInterests: string[] = [];

  courses: Course[] = [];
  adminMessage: string = '';

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

  ngOnInit(): void {
    this.loadCurrentUser();
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
    const loadedCourses = this.courseService.getCourses();
    this.courses = [...loadedCourses].sort((a, b) => a.title.localeCompare(b.title));
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

  createCourse(): void {
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

  deleteCourse(courseId: number): void {
    const ok = this.courseService.deleteCourse(courseId);

    if (ok == true) {
      this.adminMessage = 'Course deleted successfully.';
      this.loadCourses();
    } else {
      this.adminMessage = 'The course could not be deleted.';
    }
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