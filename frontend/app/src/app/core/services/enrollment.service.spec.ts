import { TestBed } from '@angular/core/testing';

import { EnrollmentService } from './enrollment.service';

describe('EnrollmentService', () => {
  let service: EnrollmentService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollmentService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should update enrollment progress for a user course', () => {
    const wasUpdated = service.updateEnrollmentProgress(1, 21, 80);
    const enrollment = service
      .getUserEnrollments(1)
      .find((item) => item.courseId === 21);

    expect(wasUpdated).toBeTrue();
    expect(enrollment?.progress).toBe(80);
  });

  it('should clamp progress between 0 and 100', () => {
    service.updateEnrollmentProgress(1, 21, 140);
    let enrollment = service
      .getUserEnrollments(1)
      .find((item) => item.courseId === 21);

    expect(enrollment?.progress).toBe(100);

    service.updateEnrollmentProgress(1, 21, -20);
    enrollment = service
      .getUserEnrollments(1)
      .find((item) => item.courseId === 21);

    expect(enrollment?.progress).toBe(0);
  });

  it('should return false when the enrollment does not exist', () => {
    const wasUpdated = service.updateEnrollmentProgress(999, 999, 50);

    expect(wasUpdated).toBeFalse();
  });
});
