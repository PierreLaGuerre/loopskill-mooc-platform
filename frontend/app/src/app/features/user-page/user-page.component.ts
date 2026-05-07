import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { User } from '../../core/models/user.model';
import { Course } from '../../core/models/course.model';
import { EnrollmentWithCourse } from '../../core/models/enrollment.model';

interface UserLearningItem {
  course: Course;
  enrollment: EnrollmentWithCourse;
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

    this.enrollmentService.getMyInProgressEnrollments().subscribe({
      next: (enrollments) => {
        this.inProgressCourses = this.toLearningItems(enrollments)
          .sort((a, b) => b.enrollment.progress - a.enrollment.progress);
      },
      error: () => {
        this.inProgressCourses = [];
      }
    });

    this.enrollmentService.getMyCompletedEnrollments().subscribe({
      next: (enrollments) => {
        this.completedCourses = this.toLearningItems(enrollments)
          .sort((a, b) => b.enrollment.id - a.enrollment.id);
      },
      error: () => {
        this.completedCourses = [];
      }
    });
  }

  private toLearningItems(enrollments: EnrollmentWithCourse[]): UserLearningItem[] {
    return enrollments
      .map((enrollment) => {
        if (enrollment.course == null) {
          return null;
        }

        return {
          course: enrollment.course,
          enrollment: enrollment
        };
      })
      .filter((item): item is UserLearningItem => item != null);
  }
}
