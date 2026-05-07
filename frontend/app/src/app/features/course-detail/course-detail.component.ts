import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Course } from '../../core/models/course.model';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { CourseOutcome } from '../../core/models/course.model';
import { EnrollmentWithCourse } from '../../core/models/enrollment.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);

  course: Course | null = null;
  courseOutcomes: CourseOutcome[] = [];
  currentUser: User | null = null;
  isEnrolled: boolean = false;
  hasAccess: boolean = false;
  enrollment: EnrollmentWithCourse | null = null;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    const courseIdParam = this.route.snapshot.paramMap.get('id');

    if (courseIdParam == null) {
      this.course = null;
      this.courseOutcomes = [];
      this.isLoading = false;
      return;
    }

    const courseId = Number(courseIdParam);

    this.courseService.getCourseDetail(courseId).subscribe({
      next: (detail) => {
        this.course = detail.course;
        this.courseOutcomes = detail.outcomes.sort((a, b) => a.displayOrder - b.displayOrder);
        this.enrollment = detail.enrollment;
        this.isEnrolled = detail.enrollment != null;
        this.hasAccess = this.checkIfHasAccess(detail.course.requiredPlan);
        this.isLoading = false;
      },
      error: () => {
        this.course = null;
        this.courseOutcomes = [];
        this.enrollment = null;
        this.isEnrolled = false;
        this.hasAccess = false;
        this.isLoading = false;
      }
    });
  }

  get ctaLabel(): string {
    if (this.isEnrolled === true) {
      return 'Continue course';
    }

    if (this.hasAccess === true) {
      return 'Start course';
    }

    return 'Upgrade plan';
  }

  onCtaClick(): void {
    if (this.course == null) {
      return;
    }

    if (this.currentUser == null) {
      this.router.navigateByUrl('/auth');
      return;
    }

    if (this.isEnrolled === true) {
      this.router.navigate(['/courses', this.course.id, 'learn']);
      return;
    }

    if (this.hasAccess === true) {
      this.enrollmentService.createEnrollment(this.course.id).subscribe({
        next: (enrollment) => {
          this.enrollment = enrollment;
          this.isEnrolled = true;
          this.router.navigate(['/courses', this.course!.id, 'learn']);
        }
      });
      return;
    }

    this.router.navigateByUrl('/plans');
  }

  private checkIfHasAccess(requiredPlan: string): boolean {
    if (this.currentUser == null) {
      return false;
    }

    const userPlanRank = this.getPlanRankByPlanId(this.currentUser.planId);
    const requiredPlanRank = this.getPlanRankByName(requiredPlan);

    if (userPlanRank >= requiredPlanRank) {
      return true;
    } else {
      return false;
    }
  }

  private getPlanRankByPlanId(planId: number): number {
    if (planId === 1) {
      return 1;
    }

    if (planId === 2) {
      return 2;
    }

    if (planId === 3) {
      return 3;
    }

    return 0;
  }

  private getPlanRankByName(planName: string): number {
    const normalizedPlanName = planName.trim().toLowerCase();

    if (normalizedPlanName === 'free') {
      return 1;
    }

    if (normalizedPlanName === 'pro') {
      return 2;
    }

    if (normalizedPlanName === 'premium') {
      return 3;
    }

    return 0;
  }
}
