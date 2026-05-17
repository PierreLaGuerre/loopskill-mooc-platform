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
    this.courseService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        this.categories = [];
      }
    });
  }
}
