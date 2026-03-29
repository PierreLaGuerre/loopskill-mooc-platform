import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopularCoursesSectionComponent } from './components/popular-courses-section/popular-courses-section.component';
import { RecommendedCoursesSectionComponent } from './components/recommended-courses-section/recommended-courses-section.component';
import { CategoriesSectionComponent } from './components/categories-section/categories-section.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    PopularCoursesSectionComponent,
    RecommendedCoursesSectionComponent,
    CategoriesSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent { }