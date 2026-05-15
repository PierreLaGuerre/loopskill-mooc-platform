import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { EnrollmentWithCourse } from '../models/enrollment.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

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
