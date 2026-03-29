import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseCardComponent } from '../../../../shared/components/course-card/course-card.component';

import { Course } from '../../../../core/models/course.model';
import { MOCK_COURSES } from '../../../../core/mocks/mock-courses';
import { MOCK_USER } from '../../../../core/mocks/mock-user';

@Component({
  selector: 'app-recommended-courses-section',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './recommended-courses-section.component.html',
  styleUrl: './recommended-courses-section.component.scss'
})
export class RecommendedCoursesSectionComponent {
  recommendedCourses: Course[] = this.getRecommendedCourses();

  private getRecommendedCourses(): Course[] {
    const userInterests = MOCK_USER.interests;

    return [...MOCK_COURSES]
      .map((course) => {
        const matchCount = course.tags.filter((tag) =>
          userInterests.includes(tag)
        ).length;

        return {
          course,
          matchCount
        };
      })
      .filter((item) => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 4)
      .map((item) => item.course);
  }
}