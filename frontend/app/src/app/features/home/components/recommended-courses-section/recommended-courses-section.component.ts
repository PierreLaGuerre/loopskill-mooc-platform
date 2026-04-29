import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseCardComponent } from '../../../../shared/components/course-card/course-card.component';

import { Course } from '../../../../core/models/course.model';
import { User } from '../../../../core/models/user.model';
import { MOCK_COURSES } from '../../../../core/mocks/mock-courses';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-recommended-courses-section',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './recommended-courses-section.component.html',
  styleUrl: './recommended-courses-section.component.scss'
})
export class RecommendedCoursesSectionComponent implements OnInit {
  private authService = inject(AuthService);

  currentUser: User | null = null;
  recommendedCourses: Course[] = [];

  ngOnInit(): void {
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.currentUser = user;
      this.recommendedCourses = this.getRecommendedCourses();
    });
  }

  private getRecommendedCourses(): Course[] {
    if (this.currentUser == null) {
      return [];
    }

    const userInterests = this.currentUser.interests.map((interest) =>
      this.normalizeTag(interest)
    );

    return [...MOCK_COURSES]
      .map((course) => {
        const matchCount = course.tags.filter((tag) =>
          userInterests.includes(this.normalizeTag(tag))
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

  private normalizeTag(tag: string): string {
    return tag.trim().toLowerCase();
  }
}
