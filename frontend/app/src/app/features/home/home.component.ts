import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopularCoursesSectionComponent } from './components/popular-courses-section/popular-courses-section.component';
import { RecommendedCoursesSectionComponent } from './components/recommended-courses-section/recommended-courses-section.component';
import { CategoriesSectionComponent } from './components/categories-section/categories-section.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';

import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

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
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);

  currentUser: User | null = null;

  ngOnInit(): void {
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.currentUser = user;
    });
  }
}