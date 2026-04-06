import { Injectable } from '@angular/core';
import { Enrollment } from '../mocks/mock-enrollments';
import { MOCK_ENROLLMENTS } from '../mocks/mock-enrollments';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private readonly STORAGE_ENROLLMENTS_KEY = 'loopskill_enrollments';

  constructor() {
    this.initializeEnrollments();
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

  createEnrollment(userId: number, courseId: number): Enrollment | null {
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
}