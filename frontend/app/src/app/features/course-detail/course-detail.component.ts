import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Course } from '../../core/models/course.model';
import { MOCK_COURSES } from '../../core/mocks/mock-courses';
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

  course: Course | null = null;
  courseOutcomes: CourseOutcome[] = [];

  ngOnInit(): void {
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
    } else {
      this.courseOutcomes = [];
    }
  }
}