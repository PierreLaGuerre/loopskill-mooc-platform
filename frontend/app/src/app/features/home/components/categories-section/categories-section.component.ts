import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';

import { Category } from '../../../../core/models/category.model';
import { MOCK_CATEGORIES } from '../../../../core/mocks/mock-categories';

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [CommonModule, CategoryCardComponent],
  templateUrl: './categories-section.component.html',
  styleUrl: './categories-section.component.scss'
})
export class CategoriesSectionComponent {
  categories: Category[] = MOCK_CATEGORIES;
}