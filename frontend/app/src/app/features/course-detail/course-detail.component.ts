import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Course } from '../../core/models/course.model';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { EnrollmentWithCourse } from '../../core/models/enrollment.model';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private paymentService = inject(PaymentService);

  course: Course | null = null;
  courseOutcomes: string[] = [];
  currentUser: User | null = null;
  isEnrolled: boolean = false;
  hasAccess: boolean = false;
  enrollment: EnrollmentWithCourse | null = null;
  isLoading: boolean = true;
  isStartingCheckout: boolean = false;
  paymentMessage: string = '';
  private routeParamsSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.handlePaymentReturn();

    this.routeParamsSubscription = this.route.paramMap.subscribe((paramMap) => {
      const courseIdParam = paramMap.get('id');

      if (courseIdParam == null) {
        this.course = null;
        this.courseOutcomes = [];
        this.isLoading = false;
        return;
      }

      const courseId = Number(courseIdParam);

      if (Number.isNaN(courseId)) {
        this.course = null;
        this.courseOutcomes = [];
        this.isLoading = false;
        return;
      }

      this.loadCourseDetail(courseId);
    });
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
  }

  loadCourseDetail(courseId: number): void {
    this.isLoading = true;
    this.courseService.getCourseDetail(courseId).subscribe({
      next: (detail) => {
        this.course = detail.course;
        this.courseOutcomes = detail.outcomes;
        this.enrollment = detail.enrollment;
        this.isEnrolled = detail.enrollment != null;
        this.hasAccess = detail.access?.hasAccess ?? false;
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

  onBuyCourseClick(): void {
    if (this.course == null || this.isStartingCheckout === true) {
      return;
    }

    this.isStartingCheckout = true;
    this.paymentMessage = '';

    this.paymentService.createCourseCheckout(this.course.id).subscribe({
      next: (checkout) => {
        this.paymentService.redirectToCheckout(checkout.checkoutUrl);
      },
      error: (error) => {
        this.isStartingCheckout = false;
        this.paymentMessage = error.error?.message || 'Could not start Stripe checkout.';
      }
    });
  }

  getIndividualPurchasePrice(): string {
    if (this.course?.requiredPlanId === 2) {
      return '6.99 €';
    }

    if (this.course?.requiredPlanId === 3) {
      return '12.99 €';
    }

    return '';
  }

  private handlePaymentReturn(): void {
    const paymentStatus = this.route.snapshot.queryParamMap.get('payment');

    if (paymentStatus === 'success') {
      this.paymentMessage = 'Payment completed. Access will unlock as soon as the Stripe webhook is processed.';
    }

    if (paymentStatus === 'cancelled') {
      this.paymentMessage = 'Stripe checkout was cancelled. The course has not been purchased.';
    }
  }
}
