import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MOCK_COURSES } from '../../../../core/mocks/mock-courses';

import { User } from '../../../../core/models/user.model';
import { Course } from '../../../../core/models/course.model';
import { AuthService } from '../../../../core/services/auth.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { Enrollment } from '../../../../core/mocks/mock-enrollments';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent implements OnInit {
  private authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);

  user: User | null = null;
  currentEnrollment: Enrollment | null = null;
  currentCourse: Course | null = null;

  ngOnInit(): void {
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.user = user;
      this.loadHeroData();
    });
  }

  private loadHeroData(): void {
    if (this.user == null) {
      this.currentEnrollment = null;
      this.currentCourse = null;
      return;
    }

    const userEnrollments = this.enrollmentService.getUserEnrollments(this.user.id);

    this.currentEnrollment =
      userEnrollments
        .filter(
          (enrollment) =>
            enrollment.progress >= 0 &&
            enrollment.progress < 100
        )
        .sort((a, b) => b.progress - a.progress)[0] || null;

    this.currentCourse =
      this.currentEnrollment != null
        ? MOCK_COURSES.find((course) => course.id === this.currentEnrollment!.courseId) || null
        : null;
  }
}