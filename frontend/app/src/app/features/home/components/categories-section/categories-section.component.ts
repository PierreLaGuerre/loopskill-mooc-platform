import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';

import { Category } from '../../../../core/models/category.model';
import { CourseService } from '../../../../core/services/course.service';

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [CommonModule, CategoryCardComponent],
  templateUrl: './categories-section.component.html',
  styleUrl: './categories-section.component.scss'
})
export class CategoriesSectionComponent implements OnInit {
  private courseService = inject(CourseService);

  categories: Category[] = [];

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        const categoryNames = Array.from(new Set(courses.map((course) => course.category)))
          .sort((a, b) => a.localeCompare(b));

        this.categories = categoryNames.map((categoryName, index) => ({
          id: index + 1,
          name: categoryName,
          description: `Courses about ${categoryName}.`,
          icon: this.getCategoryIcon(categoryName)
        }));
      },
      error: () => {
        this.categories = [];
      }
    });
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
