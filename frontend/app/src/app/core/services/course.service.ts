import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Category } from '../models/category.model';
import { Course, CourseDetailResponse } from '../models/course.model';
import { Lesson } from '../models/lesson.model';
import { AuthService } from './auth.service';

export interface CourseFilters {
  category?: string | null;
  level?: string | null;
  tags?: string[] | string | null;
  search?: string | null;
}

export type AdminCoursePayload = Omit<Course, 'id' | 'isPopular' | 'createdAt'> & {
  id?: number;
};

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getCourses(filters: CourseFilters = {}): Observable<Course[]> {
    let params = new HttpParams();

    if (filters.category != null && filters.category.trim() !== '') {
      params = params.set('category', filters.category.trim());
    }

    if (filters.level != null && filters.level.trim() !== '') {
      params = params.set('level', filters.level.trim());
    }

    if (filters.search != null && filters.search.trim() !== '') {
      params = params.set('search', filters.search.trim());
    }

    if (filters.tags != null) {
      const tags = Array.isArray(filters.tags) ? filters.tags.join(',') : filters.tags;

      if (tags.trim() !== '') {
        params = params.set('tags', tags.trim());
      }
    }

    return this.http
      .get<ApiResponse<{ courses: Course[] }>>(`${this.apiUrl}/courses`, { params })
      .pipe(map((response) => response.data.courses));
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<ApiResponse<{ categories: Omit<Category, 'icon'>[] }>>(`${this.apiUrl}/courses/categories`)
      .pipe(
        map((response) => response.data.categories.map((category) => ({
          ...category,
          icon: this.getCategoryIcon(category.name)
        })))
      );
  }

  getCourseById(id: number): Observable<CourseDetailResponse> {
    return this.getCourseDetail(id);
  }

  getCourseDetail(id: number): Observable<CourseDetailResponse> {
    return this.http
      .get<ApiResponse<CourseDetailResponse>>(`${this.apiUrl}/courses/${id}`, {
        headers: this.getAuthHeaders()
      })
      .pipe(map((response) => response.data));
  }

  getLessonsByCourseId(courseId: number): Observable<Lesson[]> {
    return this.http
      .get<ApiResponse<{ lessons: Lesson[] }>>(`${this.apiUrl}/courses/${courseId}/lessons`, {
        headers: this.getAuthHeaders()
      })
      .pipe(map((response) => response.data.lessons));
  }

  getPopularCourses(): Observable<Course[]> {
    return this.http
      .get<ApiResponse<{ courses: Course[] }>>(`${this.apiUrl}/courses/popular`)
      .pipe(map((response) => response.data.courses));
  }

  getRecommendedCourses(): Observable<Course[]> {
    return this.http
      .get<ApiResponse<{ courses: Course[] }>>(`${this.apiUrl}/courses/recommended`, {
        headers: this.getAuthHeaders()
      })
      .pipe(map((response) => response.data.courses));
  }

  getAdminCourses(): Observable<Course[]> {
    return this.http
      .get<ApiResponse<{ courses: Course[] }>>(`${this.apiUrl}/admin/courses`, {
        headers: this.getAuthHeaders()
      })
      .pipe(map((response) => response.data.courses));
  }

  getAdminCourseById(id: number): Observable<Course> {
    return this.http
      .get<ApiResponse<{ course: Course }>>(`${this.apiUrl}/admin/courses/${id}`, {
        headers: this.getAuthHeaders()
      })
      .pipe(map((response) => response.data.course));
  }

  getAdminCategories(): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<ApiResponse<{ categories: { id: number; name: string }[] }>>(
        `${this.apiUrl}/admin/categories`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(map((response) => response.data.categories));
  }

  getAdminTags(): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<ApiResponse<{ tags: { id: number; name: string }[] }>>(`${this.apiUrl}/admin/tags`, {
        headers: this.getAuthHeaders()
      })
      .pipe(map((response) => response.data.tags));
  }

  createCourse(courseData: AdminCoursePayload): Observable<Course> {
    return this.http
      .post<ApiResponse<{ course: Course }>>(
        `${this.apiUrl}/admin/courses`,
        this.toAdminPayload(courseData),
        { headers: this.getAuthHeaders() }
      )
      .pipe(map((response) => response.data.course));
  }

  updateCourse(updatedCourse: Course): Observable<Course> {
    return this.http
      .patch<ApiResponse<{ course: Course }>>(
        `${this.apiUrl}/admin/courses/${updatedCourse.id}`,
        this.toAdminPayload(updatedCourse),
        { headers: this.getAuthHeaders() }
      )
      .pipe(map((response) => response.data.course));
  }

  deleteCourse(id: number): Observable<number> {
    return this.http
      .delete<ApiResponse<{ courseId: number }>>(`${this.apiUrl}/admin/courses/${id}`, {
        headers: this.getAuthHeaders()
      })
      .pipe(map((response) => response.data.courseId));
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

  private toAdminPayload(course: AdminCoursePayload): Record<string, unknown> {
    return {
      title: course.title,
      slug: course.slug,
      shortDescription: course.shortDescription ?? course.description,
      description: course.description,
      level: course.level.toLowerCase(),
      categoryId: course.categoryId,
      category: course.category,
      requiredPlanId: course.requiredPlanId ?? this.getPlanIdByName(course.requiredPlan),
      image: course.image,
      instructor: course.instructor,
      durationHours: course.durationHours,
      lessonsCount: course.lessonsCount,
      tags: course.tags
    };
  }

  private getPlanIdByName(planName: string): number {
    const normalizedPlanName = planName.trim().toLowerCase();

    if (normalizedPlanName === 'pro') {
      return 2;
    }

    if (normalizedPlanName === 'premium') {
      return 3;
    }

    return 1;
  }

  private getCategoryIcon(categoryName: string): string {
    const normalizedCategory = categoryName.trim().toLowerCase();

    if (normalizedCategory === 'cloud') {
      return 'assets/images/categories/cloud.png';
    }

    if (normalizedCategory === 'databases') {
      return 'assets/images/categories/databases.png';
    }

    if (normalizedCategory === 'data science') {
      return 'assets/images/categories/datascience.png';
    }

    if (normalizedCategory === 'devops') {
      return 'assets/images/categories/devops.png';
    }

    return 'assets/images/categories/programming.png';
  }
}
