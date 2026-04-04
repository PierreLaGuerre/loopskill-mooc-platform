import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MOCK_COURSES } from '../../../../core/mocks/mock-courses';
import { MOCK_ENROLLMENTS } from '../../../../core/mocks/mock-enrollments';

import { User } from '../../../../core/models/user.model';
import { Course } from '../../../../core/models/course.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent implements OnInit {
  private authService = inject(AuthService);

  user: User | null = null;
  currentEnrollment: any = null;
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

    this.currentEnrollment =
      MOCK_ENROLLMENTS
        .filter(
          (enrollment) =>
            enrollment.userId === this.user!.id &&
            enrollment.progress > 0 &&
            enrollment.progress < 100
        )
        .sort((a, b) => b.progress - a.progress)[0] || null;

    this.currentCourse =
      this.currentEnrollment != null
        ? MOCK_COURSES.find((course) => course.id === this.currentEnrollment.courseId) || null
        : null;
  }
}