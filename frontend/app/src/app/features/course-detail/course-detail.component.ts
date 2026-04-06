import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Course } from '../../core/models/course.model';
import { User } from '../../core/models/user.model';
import { MOCK_COURSES } from '../../core/mocks/mock-courses';
import { AuthService } from '../../core/services/auth.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import {
  CourseOutcome,
  MOCK_COURSE_OUTCOMES
} from '../../core/mocks/mock-course-outcomes';

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
  private enrollmentService = inject(EnrollmentService);

  course: Course | null = null;
  courseOutcomes: CourseOutcome[] = [];
  currentUser: User | null = null;
  isEnrolled: boolean = false;
  hasAccess: boolean = false;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    const courseIdParam = this.route.snapshot.paramMap.get('id');

    if (courseIdParam == null) {
      this.course = null;
      this.courseOutcomes = [];
      return;
    }

    const courseId = Number(courseIdParam);

    this.course = MOCK_COURSES.find((course) => course.id === courseId) || null;

    if (this.course != null) {
      this.courseOutcomes = MOCK_COURSE_OUTCOMES
        .filter((outcome) => outcome.courseId === this.course!.id)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      this.isEnrolled = this.checkIfEnrolled(this.course.id);
      this.hasAccess = this.checkIfHasAccess(this.course.requiredPlan);
    } else {
      this.courseOutcomes = [];
      this.isEnrolled = false;
      this.hasAccess = false;
    }
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
      this.router.navigateByUrl('/my-learnings');
      return;
    }

    if (this.hasAccess === true) {
      this.enrollmentService.createEnrollment(this.currentUser.id, this.course.id);
      this.isEnrolled = true;
      this.router.navigateByUrl('/my-learnings');
      return;
    }

    this.router.navigateByUrl('/plans');
  }

  private checkIfEnrolled(courseId: number): boolean {
    if (this.currentUser == null) {
      return false;
    }

    return this.enrollmentService.isUserEnrolledInCourse(this.currentUser.id, courseId);
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