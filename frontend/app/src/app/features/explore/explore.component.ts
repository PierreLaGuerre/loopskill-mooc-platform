import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MOCK_CATEGORIES } from '../../core/mocks/mock-categories';
import { MOCK_COURSES } from '../../core/mocks/mock-courses';
import { Category } from '../../core/models/category.model';
import { Course } from '../../core/models/course.model';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';

interface ExploreCategoryGroup {
  category: Category;
  courses: Course[];
}

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent implements OnInit {
  private route = inject(ActivatedRoute);

  categoryGroups: ExploreCategoryGroup[] = [];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const selectedCategory = params.get('category');
      this.buildCategoryGroups(selectedCategory);
    });
  }

  private buildCategoryGroups(selectedCategory: string | null): void {
    const sortedCategories = this.getSortedCategories(selectedCategory);

    this.categoryGroups = sortedCategories.map((category) => {
      const courses = MOCK_COURSES
        .filter((course) => course.category === category.name)
        .sort((a, b) => a.title.localeCompare(b.title));

      return {
        category: category,
        courses: courses
      };
    });
  }

  private getSortedCategories(selectedCategory: string | null): Category[] {
    const categories = [...MOCK_CATEGORIES];

    if (selectedCategory == null || selectedCategory.trim() === '') {
      return categories;
    }

    const normalizedSelectedCategory = selectedCategory.trim().toLowerCase();

    return categories.sort((a, b) => {
      const aMatches = a.name.toLowerCase() === normalizedSelectedCategory;
      const bMatches = b.name.toLowerCase() === normalizedSelectedCategory;

      if (aMatches === true && bMatches === false) {
        return -1;
      }

      if (aMatches === false && bMatches === true) {
        return 1;
      }

      return 0;
    });
  }
}