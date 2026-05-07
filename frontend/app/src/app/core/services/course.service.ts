import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Course, CourseDetailResponse } from '../models/course.model';
import { Lesson } from '../models/lesson.model';
import { MOCK_COURSES } from '../mocks/mock-courses';
import { MOCK_LESSONS } from '../mocks/mock-lessons';
import { AuthService } from './auth.service';

export interface CourseFilters {
  category?: string | null;
  level?: string | null;
  tags?: string[] | string | null;
  search?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly STORAGE_COURSES_KEY = 'loopskill_courses';
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.initializeCourses();
  }

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
      .get<ApiResponse<{ lessons: Lesson[] }>>(`${this.apiUrl}/courses/${courseId}/lessons`)
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

  getAdminCourses(): Course[] {
    const coursesJson = localStorage.getItem(this.STORAGE_COURSES_KEY);

    if (coursesJson != null) {
      return JSON.parse(coursesJson) as Course[];
    } else {
      return [];
    }
  }

  getAdminCourseById(id: number): Course | null {
    const courses = this.getAdminCourses();

    const foundCourse = courses.find((course) => course.id === id);

    if (foundCourse != null) {
      return foundCourse;
    } else {
      return null;
    }
  }

  getMockLessonsByCourseId(courseId: number): Lesson[] {
    return MOCK_LESSONS
      .filter((lesson) => lesson.courseId === courseId)
      .sort((firstLesson, secondLesson) => firstLesson.displayOrder - secondLesson.displayOrder);
  }

  createCourse(courseData: Omit<Course, 'id'>): Course {
    const courses = this.getAdminCourses();

    const newCourse: Course = {
      id: this.generateNextId(courses),
      ...courseData
    };

    const updatedCourses: Course[] = [...courses, newCourse];
    localStorage.setItem(this.STORAGE_COURSES_KEY, JSON.stringify(updatedCourses));

    return newCourse;
  }

  updateCourse(updatedCourse: Course): boolean {
    const courses = this.getAdminCourses();

    const exists = courses.some((course) => course.id === updatedCourse.id);

    if (exists == false) {
      return false;
    }

    const updatedCourses = courses.map((course) => {
      if (course.id === updatedCourse.id) {
        return updatedCourse;
      } else {
        return course;
      }
    });

    localStorage.setItem(this.STORAGE_COURSES_KEY, JSON.stringify(updatedCourses));
    return true;
  }

  deleteCourse(id: number): boolean {
    const courses = this.getAdminCourses();

    const exists = courses.some((course) => course.id === id);

    if (exists == false) {
      return false;
    }

    const updatedCourses = courses.filter((course) => course.id !== id);
    localStorage.setItem(this.STORAGE_COURSES_KEY, JSON.stringify(updatedCourses));

    return true;
  }

  private initializeCourses(): void {
    const storedCourses = localStorage.getItem(this.STORAGE_COURSES_KEY);

    if (storedCourses == null) {
      localStorage.setItem(this.STORAGE_COURSES_KEY, JSON.stringify(MOCK_COURSES));
    }
  }

  private generateNextId(courses: Course[]): number {
    if (courses.length === 0) {
      return 1;
    } else {
      const ids = courses.map((course) => course.id);
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
