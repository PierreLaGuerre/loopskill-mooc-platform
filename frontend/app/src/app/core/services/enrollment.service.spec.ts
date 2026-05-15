import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { EnrollmentService } from './enrollment.service';

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: {
            getToken: () => 'test-token'
          }
        }
      ]
    });

    service = TestBed.inject(EnrollmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an enrollment through the backend API', () => {
    service.createEnrollment(21).subscribe((enrollment) => {
      expect(enrollment.courseId).toBe(21);
      expect(enrollment.progress).toBe(0);
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/enrollments`);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ courseId: 21 });
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');

    request.flush({
      success: true,
      message: 'Enrollment created successfully',
      data: {
        enrollment: {
          id: 1,
          userId: 1,
          courseId: 21,
          progress: 0,
          isCompleted: false,
          enrolledAt: '2026-05-15T00:00:00.000Z'
        }
      }
    });
  });

  it('should clamp progress before sending it to the backend', () => {
    service.updateEnrollmentProgress(21, 140).subscribe((enrollment) => {
      expect(enrollment.progress).toBe(100);
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/enrollments/21/progress`);

    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ progress: 100 });

    request.flush({
      success: true,
      message: 'Enrollment progress updated successfully',
      data: {
        enrollment: {
          id: 1,
          userId: 1,
          courseId: 21,
          progress: 100,
          isCompleted: true,
          enrolledAt: '2026-05-15T00:00:00.000Z'
        }
      }
    });
  });

  it('should load completed enrollments from the backend', () => {
    service.getMyCompletedEnrollments().subscribe((enrollments) => {
      expect(enrollments.length).toBe(1);
      expect(enrollments[0].isCompleted).toBeTrue();
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/enrollments/me/completed`);

    expect(request.request.method).toBe('GET');

    request.flush({
      success: true,
      message: 'Completed enrollments retrieved successfully',
      data: {
        enrollments: [
          {
            id: 1,
            userId: 1,
            courseId: 21,
            progress: 100,
            isCompleted: true,
            enrolledAt: '2026-05-15T00:00:00.000Z'
          }
        ]
      }
    });
  });
});
