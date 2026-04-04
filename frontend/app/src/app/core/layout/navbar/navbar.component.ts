import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MOCK_COURSES } from '../../mocks/mock-courses';
import { Course } from '../../models/course.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);

  user: User | null = null;

  isMobileMenuOpen: boolean = false;
  searchTerm: string = '';
  isSearchOpen: boolean = false;

  ngOnInit(): void {
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.user = user;
    });
  }

  get userInitial(): string {
    if (this.user != null && this.user.name.trim() !== '') {
      return this.user.name.charAt(0).toUpperCase();
    } else {
      return '?';
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  openSearch(): void {
    this.isSearchOpen = true;
  }

  closeSearch(): void {
    this.isSearchOpen = false;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.closeSearch();
  }

  get filteredCourses(): Course[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (term === '') {
      return [];
    }

    return MOCK_COURSES.filter((course) => {
      const matchesTitle = course.title.toLowerCase().includes(term);
      const matchesCategory = course.category.toLowerCase().includes(term);
      const matchesTags = course.tags.some((tag) =>
        tag.toLowerCase().includes(term)
      );

      return matchesTitle || matchesCategory || matchesTags;
    }).slice(0, 6);
  }
}