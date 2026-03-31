import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MOCK_USER } from '../../../../core/mocks/mock-user';
import { MOCK_COURSES } from '../../../../core/mocks/mock-courses';
import { MOCK_ENROLLMENTS } from '../../../../core/mocks/mock-enrollments';

import { User } from '../../../../core/models/user.model';
import { Course } from '../../../../core/models/course.model';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  user: User = MOCK_USER;

  currentEnrollment =
    MOCK_ENROLLMENTS
      .filter((enrollment) => enrollment.userId === this.user.id && enrollment.progress > 0 && enrollment.progress < 100)
      .sort((a, b) => b.progress - a.progress)[0] || null;

  currentCourse: Course | null =
    this.currentEnrollment
      ? MOCK_COURSES.find((course) => course.id === this.currentEnrollment!.courseId) || null
      : null;
}