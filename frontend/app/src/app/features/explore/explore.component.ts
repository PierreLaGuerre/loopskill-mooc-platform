import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren,
  inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MOCK_CATEGORIES } from '../../core/mocks/mock-categories';
import { Category } from '../../core/models/category.model';
import { Course } from '../../core/models/course.model';
import { CourseService } from '../../core/services/course.service';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';

interface ExploreCategoryGroup {
  category: Category;
  courses: Course[];
}

interface ExploreCarouselState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);

  @ViewChildren('coursesTrack')
  private courseTracks?: QueryList<ElementRef<HTMLElement>>;

  readonly allCategoriesLabel = 'All categories';
  categories: Category[] = MOCK_CATEGORIES;
  courses: Course[] = [];
  selectedCategoryName = this.allCategoriesLabel;
  categoryGroups: ExploreCategoryGroup[] = [];
  carouselStates: Record<string, ExploreCarouselState> = {};

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.selectedCategoryName = this.getSelectedCategoryName(params.get('category'));
      const category = this.selectedCategoryName === this.allCategoriesLabel
        ? null
        : this.selectedCategoryName;

      this.courseService.getCourses({ category }).subscribe({
        next: (courses) => {
          this.courses = courses;
          this.syncCategoriesFromCourses();
          this.buildCategoryGroups();
          this.updateCarouselButtonsSoon();
        },
        error: () => {
          this.courses = [];
          this.categoryGroups = [];
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.courseTracks?.changes.subscribe(() => {
      this.updateAllCarouselButtons();
    });

    this.updateCarouselButtonsSoon();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateAllCarouselButtons();
  }

  selectCategory(categoryName: string): void {
    this.selectedCategoryName = categoryName;

    const queryParams = categoryName === this.allCategoriesLabel
      ? { category: null }
      : { category: categoryName };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  isCategorySelected(categoryName: string): boolean {
    return this.selectedCategoryName === categoryName;
  }

  scrollCategoryCourses(categoryName: string, direction: 'left' | 'right'): void {
    const track = this.getCourseTrack(categoryName);

    if (track == null) {
      return;
    }

    const firstCourseCard = track.querySelector('app-course-card');
    const cardWidth = firstCourseCard?.getBoundingClientRect().width ?? track.clientWidth;
    const trackStyles = window.getComputedStyle(track);
    const trackGap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    const courseStep = cardWidth + trackGap;
    const scrollAmount = direction === 'left' ? -courseStep : courseStep;

    track.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });

    window.setTimeout(() => {
      this.updateCarouselButtons(track, categoryName);
    }, 250);
  }

  updateCarouselButtons(track: HTMLElement, categoryName: string): void {
    const maxScrollLeft = track.scrollWidth - track.clientWidth;

    this.carouselStates = {
      ...this.carouselStates,
      [categoryName]: {
        canScrollLeft: track.scrollLeft > 0,
        canScrollRight: track.scrollLeft < maxScrollLeft - 1
      }
    };
  }

  canScrollLeft(categoryName: string): boolean {
    return this.carouselStates[categoryName]?.canScrollLeft ?? false;
  }

  canScrollRight(categoryName: string): boolean {
    return this.carouselStates[categoryName]?.canScrollRight ?? false;
  }

  private buildCategoryGroups(): void {
    const visibleCategories = this.selectedCategoryName === this.allCategoriesLabel
      ? this.categories
      : this.categories.filter((category) => category.name === this.selectedCategoryName);

    this.categoryGroups = visibleCategories.map((category) => {
      const courses = this.courses
        .filter((course) => course.category === category.name)
        .sort((a, b) => a.title.localeCompare(b.title));

      return {
        category: category,
        courses: courses
      };
    });
  }

  private getSelectedCategoryName(selectedCategory: string | null): string {
    if (selectedCategory == null || selectedCategory.trim() === '') {
      return this.allCategoriesLabel;
    }

    const normalizedSelectedCategory = selectedCategory.trim().toLowerCase();
    const matchedCategory = this.categories.find(
      (category) => category.name.toLowerCase() === normalizedSelectedCategory
    );

    return matchedCategory?.name ?? this.allCategoriesLabel;
  }

  private syncCategoriesFromCourses(): void {
    const categoryNames = new Set(this.courses.map((course) => course.category));
    const knownCategories = MOCK_CATEGORIES.filter((category) => categoryNames.has(category.name));
    const knownCategoryNames = new Set(knownCategories.map((category) => category.name));
    const dynamicCategories = Array.from(categoryNames)
      .filter((categoryName) => knownCategoryNames.has(categoryName) === false)
      .sort((a, b) => a.localeCompare(b))
      .map((categoryName, index) => ({
        id: MOCK_CATEGORIES.length + index + 1,
        name: categoryName,
        description: `Courses about ${categoryName}.`,
        icon: 'assets/images/categories/programming.png'
      } as Category));

    this.categories = [...knownCategories, ...dynamicCategories];
  }

  private updateAllCarouselButtons(): void {
    this.courseTracks?.forEach((trackRef) => {
      const track = trackRef.nativeElement;
      const categoryName = track.dataset['categoryName'];

      if (categoryName != null) {
        this.updateCarouselButtons(track, categoryName);
      }
    });
  }

  private getCourseTrack(categoryName: string): HTMLElement | null {
    const trackRef = this.courseTracks?.find(
      (item) => item.nativeElement.dataset['categoryName'] === categoryName
    );

    return trackRef?.nativeElement ?? null;
  }

  private updateCarouselButtonsSoon(): void {
    window.setTimeout(() => {
      this.updateAllCarouselButtons();
    });
  }
}
