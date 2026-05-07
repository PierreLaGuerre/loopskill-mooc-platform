import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { User } from '../../../../core/models/user.model';
import { Course } from '../../../../core/models/course.model';
import { AuthService } from '../../../../core/services/auth.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { EnrollmentWithCourse } from '../../../../core/models/enrollment.model';

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
  currentEnrollment: EnrollmentWithCourse | null = null;
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

    this.enrollmentService.getMyInProgressEnrollments().subscribe({
      next: (enrollments) => {
        this.currentEnrollment = enrollments
          .sort((a, b) => b.progress - a.progress)[0] || null;
        this.currentCourse = this.currentEnrollment?.course ?? null;
      },
      error: () => {
        this.currentEnrollment = null;
        this.currentCourse = null;
      }
    });
  }
}
