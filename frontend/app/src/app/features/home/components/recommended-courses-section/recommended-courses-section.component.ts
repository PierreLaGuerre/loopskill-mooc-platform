import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseCardComponent } from '../../../../shared/components/course-card/course-card.component';

import { Course } from '../../../../core/models/course.model';
import { User } from '../../../../core/models/user.model';
import { MOCK_COURSES } from '../../../../core/mocks/mock-courses';
import { AuthService } from '../../../../core/services/auth.service';

interface ScoredRecommendation {
  course: Course;
  matchCount: number;
  similarityScore: number;
}

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

    const userInterests = this.currentUser.interests.map((interest) => this.normalizeTag(interest));
    const directMatches = MOCK_COURSES
      .map((course) => this.createScoredRecommendation(course, userInterests))
      .filter((item) => item.matchCount > 0)
      .sort((a, b) => this.compareRecommendations(a, b))
      .slice(0, 4);

    if (directMatches.length >= 4) {
      return directMatches.map((item) => item.course);
    }

    const matchedTags = new Set<string>(
      directMatches.flatMap((item) => item.course.tags.map((tag) => this.normalizeTag(tag)))
    );
    const matchedCategories = new Set<string>(
      directMatches.map((item) => this.normalizeCategory(item.course.category))
    );
    const selectedCourseIds = new Set<number>(directMatches.map((item) => item.course.id));
    const fallbackCourses = MOCK_COURSES
      .filter((course) => selectedCourseIds.has(course.id) === false)
      .map((course) => {
        const normalizedTags = course.tags.map((tag) => this.normalizeTag(tag));
        const sharesMatchedTag = normalizedTags.some((tag) => matchedTags.has(tag));
        const sharesMatchedCategory = matchedCategories.has(
          this.normalizeCategory(course.category)
        );

        let similarityScore = 0;

        if (sharesMatchedTag === true) {
          similarityScore += 3;
        }

        if (sharesMatchedCategory === true) {
          similarityScore += 2;
        }

        if (course.isPopular === true) {
          similarityScore += 1;
        }

        return {
          course,
          matchCount: 0,
          similarityScore
        };
      })
      .sort((a, b) => this.compareRecommendations(a, b))
      .slice(0, 4 - directMatches.length);

    return [...directMatches, ...fallbackCourses].map((item) => item.course);
  }

  private normalizeTag(tag: string): string {
    return tag.trim().toLowerCase();
  }

  private normalizeCategory(category: string): string {
    return category.trim().toLowerCase();
  }

  private createScoredRecommendation(
    course: Course,
    userInterests: string[]
  ): ScoredRecommendation {
    const matchCount = course.tags.filter((tag) =>
      userInterests.includes(this.normalizeTag(tag))
    ).length;

    return {
      course,
      matchCount,
      similarityScore: 0
    };
  }

  private compareRecommendations(
    a: ScoredRecommendation,
    b: ScoredRecommendation
  ): number {
    if (b.matchCount !== a.matchCount) {
      return b.matchCount - a.matchCount;
    }

    if (b.similarityScore !== a.similarityScore) {
      return b.similarityScore - a.similarityScore;
    }

    return a.course.id - b.course.id;
  }
}
