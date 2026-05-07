import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Enrollment, EnrollmentWithCourse } from '../models/enrollment.model';
import { MOCK_ENROLLMENTS } from '../mocks/mock-enrollments';
import { AuthService } from './auth.service';

export interface CourseEnrollmentCount {
  courseId: number;
  enrollmentCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private readonly STORAGE_ENROLLMENTS_KEY = 'loopskill_enrollments';
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.initializeEnrollments();
  }

  createEnrollment(courseId: number): Observable<EnrollmentWithCourse> {
    return this.http
      .post<ApiResponse<{ enrollment: EnrollmentWithCourse }>>(
        `${this.apiUrl}/enrollments`,
        { courseId },
        { headers: this.getAuthHeaders() }
      )
      .pipe(map((response) => response.data.enrollment));
  }

  getMyEnrollments(): Observable<EnrollmentWithCourse[]> {
    return this.http
      .get<ApiResponse<{ enrollments: EnrollmentWithCourse[] }>>(`${this.apiUrl}/enrollments/me`, {
        headers: this.getAuthHeaders()
      })
      .pipe(map((response) => response.data.enrollments));
  }

  getMyInProgressEnrollments(): Observable<EnrollmentWithCourse[]> {
    return this.http
      .get<ApiResponse<{ enrollments: EnrollmentWithCourse[] }>>(`${this.apiUrl}/enrollments/me/in-progress`, {
        headers: this.getAuthHeaders()
      })
      .pipe(map((response) => response.data.enrollments));
  }

  getMyCompletedEnrollments(): Observable<EnrollmentWithCourse[]> {
    return this.http
      .get<ApiResponse<{ enrollments: EnrollmentWithCourse[] }>>(`${this.apiUrl}/enrollments/me/completed`, {
        headers: this.getAuthHeaders()
      })
      .pipe(map((response) => response.data.enrollments));
  }

  updateEnrollmentProgress(courseId: number, progress: number): Observable<EnrollmentWithCourse> {
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);

    return this.http
      .patch<ApiResponse<{ enrollment: EnrollmentWithCourse }>>(
        `${this.apiUrl}/enrollments/${courseId}/progress`,
        { progress: normalizedProgress },
        { headers: this.getAuthHeaders() }
      )
      .pipe(map((response) => response.data.enrollment));
  }

  getEnrollments(): Enrollment[] {
    const enrollmentsJson = localStorage.getItem(this.STORAGE_ENROLLMENTS_KEY);

    if (enrollmentsJson != null) {
      return JSON.parse(enrollmentsJson) as Enrollment[];
    } else {
      return [];
    }
  }

  getUserEnrollments(userId: number): Enrollment[] {
    return this.getEnrollments().filter((enrollment) => enrollment.userId === userId);
  }

  getPopularCoursesByEnrollmentCount(): CourseEnrollmentCount[] {
    const enrollmentCounts = new Map<number, number>();

    this.getEnrollments().forEach((enrollment) => {
      const currentCount = enrollmentCounts.get(enrollment.courseId) ?? 0;
      enrollmentCounts.set(enrollment.courseId, currentCount + 1);
    });

    return Array.from(enrollmentCounts.entries())
      .map(([courseId, enrollmentCount]) => ({
        courseId,
        enrollmentCount
      }))
      .sort((a, b) => {
        if (b.enrollmentCount !== a.enrollmentCount) {
          return b.enrollmentCount - a.enrollmentCount;
        }

        return a.courseId - b.courseId;
      });
  }

  isUserEnrolledInCourse(userId: number, courseId: number): boolean {
    const foundEnrollment = this.getEnrollments().find(
      (enrollment) => enrollment.userId === userId && enrollment.courseId === courseId
    );

    if (foundEnrollment != null) {
      return true;
    } else {
      return false;
    }
  }

  createMockEnrollment(userId: number, courseId: number): Enrollment | null {
    const enrollments = this.getEnrollments();

    const existingEnrollment = enrollments.find(
      (enrollment) => enrollment.userId === userId && enrollment.courseId === courseId
    );

    if (existingEnrollment != null) {
      return null;
    }

    const newEnrollment: Enrollment = {
      id: this.generateNextId(enrollments),
      userId: userId,
      courseId: courseId,
      progress: 0,
      enrolledAt: new Date().toISOString()
    };

    const updatedEnrollments = [...enrollments, newEnrollment];
    localStorage.setItem(this.STORAGE_ENROLLMENTS_KEY, JSON.stringify(updatedEnrollments));

    return newEnrollment;
  }

  updateMockEnrollmentProgress(userId: number, courseId: number, progress: number): boolean {
    const enrollments = this.getEnrollments();
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);
    let wasUpdated = false;

    const updatedEnrollments = enrollments.map((enrollment) => {
      if (enrollment.userId === userId && enrollment.courseId === courseId) {
        wasUpdated = true;
        return {
          ...enrollment,
          progress: normalizedProgress
        };
      }

      return enrollment;
    });

    if (wasUpdated === false) {
      return false;
    }

    localStorage.setItem(this.STORAGE_ENROLLMENTS_KEY, JSON.stringify(updatedEnrollments));
    return true;
  }

  private initializeEnrollments(): void {
    const storedEnrollments = localStorage.getItem(this.STORAGE_ENROLLMENTS_KEY);

    if (storedEnrollments == null) {
      localStorage.setItem(this.STORAGE_ENROLLMENTS_KEY, JSON.stringify(MOCK_ENROLLMENTS));
    }
  }

  private generateNextId(enrollments: Enrollment[]): number {
    if (enrollments.length === 0) {
      return 1;
    } else {
      const ids = enrollments.map((enrollment) => enrollment.id);
      return Math.max(...ids) + 1;
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    if (token == null) {
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
