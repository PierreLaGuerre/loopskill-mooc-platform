import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { Lesson } from '../models/lesson.model';
import { MOCK_COURSES } from '../mocks/mock-courses';
import { MOCK_LESSONS } from '../mocks/mock-lessons';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly STORAGE_COURSES_KEY = 'loopskill_courses';

  constructor() {
    this.initializeCourses();
  }

  getCourses(): Course[] {
    const coursesJson = localStorage.getItem(this.STORAGE_COURSES_KEY);

    if (coursesJson != null) {
      return JSON.parse(coursesJson) as Course[];
    } else {
      return [];
    }
  }

  getCourseById(id: number): Course | null {
    const courses = this.getCourses();

    const foundCourse = courses.find((course) => course.id === id);

    if (foundCourse != null) {
      return foundCourse;
    } else {
      return null;
    }
  }

  getLessonsByCourseId(courseId: number): Lesson[] {
    return MOCK_LESSONS
      .filter((lesson) => lesson.courseId === courseId)
      .sort((firstLesson, secondLesson) => firstLesson.displayOrder - secondLesson.displayOrder);
  }

  createCourse(courseData: Omit<Course, 'id'>): Course {
    const courses = this.getCourses();

    const newCourse: Course = {
      id: this.generateNextId(courses),
      ...courseData
    };

    const updatedCourses: Course[] = [...courses, newCourse];
    localStorage.setItem(this.STORAGE_COURSES_KEY, JSON.stringify(updatedCourses));

    return newCourse;
  }

  updateCourse(updatedCourse: Course): boolean {
    const courses = this.getCourses();

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
    const courses = this.getCourses();

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
}
