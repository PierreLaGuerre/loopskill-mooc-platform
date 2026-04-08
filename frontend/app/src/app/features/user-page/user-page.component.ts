import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { User } from '../../core/models/user.model';
import { Course } from '../../core/models/course.model';
import { MOCK_COURSES } from '../../core/mocks/mock-courses';
import { Enrollment } from '../../core/mocks/mock-enrollments';

interface UserLearningItem {
  course: Course;
  enrollment: Enrollment;
}

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {
  private authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);

  user: User | null = null;
  activeTab: 'in-progress' | 'completed' = 'in-progress';

  inProgressCourses: UserLearningItem[] = [];
  completedCourses: UserLearningItem[] = [];

  ngOnInit(): void {
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.user = user;
      this.loadUserLearnings();
    });
  }

  setActiveTab(tab: 'in-progress' | 'completed'): void {
    this.activeTab = tab;
  }

  private loadUserLearnings(): void {
    if (this.user == null) {
      this.inProgressCourses = [];
      this.completedCourses = [];
      return;
    }

    const userEnrollments = this.enrollmentService.getUserEnrollments(this.user.id);

    const learningItems: UserLearningItem[] = userEnrollments
      .map((enrollment) => {
        const course = MOCK_COURSES.find((item) => item.id === enrollment.courseId) || null;

        if (course == null) {
          return null;
        }

        return {
          course: course,
          enrollment: enrollment
        };
      })
      .filter((item): item is UserLearningItem => item != null);

    this.inProgressCourses = learningItems
      .filter((item) => item.enrollment.progress >= 0 && item.enrollment.progress < 100)
      .sort((a, b) => b.enrollment.progress - a.enrollment.progress);

    this.completedCourses = learningItems
      .filter((item) => item.enrollment.progress === 100)
      .sort((a, b) => b.enrollment.id - a.enrollment.id);
  }
}