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
  private readonly courseLevelOrder: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3
  };
  private readonly programmingFamilyOrder: Record<string, number> = {
    python: 1,
    react: 2,
    angular: 3,
    java: 4,
    nodejs: 5
  };

  categories: Category[] = [];
  courses: Course[] = [];
  selectedCategoryName = this.allCategoriesLabel;
  categoryGroups: ExploreCategoryGroup[] = [];
  carouselStates: Record<string, ExploreCarouselState> = {};

  ngOnInit(): void {
    this.loadAvailableCategories();

    this.route.queryParamMap.subscribe((params) => {
      this.selectedCategoryName = this.getSelectedCategoryName(params.get('category'));
      const category = this.selectedCategoryName === this.allCategoriesLabel
        ? null
        : this.selectedCategoryName;

      this.courseService.getCourses({ category }).subscribe({
        next: (courses) => {
          this.courses = courses;
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
        .sort((a, b) => this.compareCoursesForDisplay(a, b, category.name));

      return {
        category: category,
        courses: this.separateRepeatedCourseFamilies(courses)
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

  private compareCoursesForDisplay(
    firstCourse: Course,
    secondCourse: Course,
    categoryName: string
  ): number {
    if (categoryName === 'Programming') {
      const firstFamilyOrder = this.getProgrammingFamilyOrder(firstCourse);
      const secondFamilyOrder = this.getProgrammingFamilyOrder(secondCourse);

      if (firstFamilyOrder !== secondFamilyOrder) {
        return firstFamilyOrder - secondFamilyOrder;
      }
    }

    const firstLevelOrder = this.getCourseLevelOrder(firstCourse.level);
    const secondLevelOrder = this.getCourseLevelOrder(secondCourse.level);

    if (firstLevelOrder !== secondLevelOrder) {
      return firstLevelOrder - secondLevelOrder;
    }

    return firstCourse.title.localeCompare(secondCourse.title);
  }

  private getProgrammingFamilyOrder(course: Course): number {
    const family = this.getCourseFamily(course);

    return this.programmingFamilyOrder[family] ?? Number.MAX_SAFE_INTEGER;
  }

  private separateRepeatedCourseFamilies(courses: Course[]): Course[] {
    const reorderedCourses = [...courses];

    for (let index = 1; index < reorderedCourses.length; index++) {
      const currentFamily = this.getCourseFamily(reorderedCourses[index]);
      const previousFamily = this.getCourseFamily(reorderedCourses[index - 1]);

      if (currentFamily !== previousFamily) {
        continue;
      }

      const replacementIndex = reorderedCourses.findIndex((course, candidateIndex) => (
        candidateIndex > index &&
        this.getCourseFamily(course) !== previousFamily &&
        this.getCourseFamily(course) !== this.getCourseFamily(reorderedCourses[index + 1] ?? course)
      ));

      if (replacementIndex !== -1) {
        const replacementCourse = reorderedCourses[replacementIndex];
        reorderedCourses[replacementIndex] = reorderedCourses[index];
        reorderedCourses[index] = replacementCourse;
      }
    }

    return reorderedCourses;
  }

  private getCourseFamily(course: Course): string {
    const firstTag = course.tags[0];

    if (firstTag != null && firstTag.trim() !== '') {
      return firstTag.trim().toLowerCase();
    }

    return course.title.split(' ')[0].trim().toLowerCase();
  }

  private getCourseLevelOrder(level: string): number {
    return this.courseLevelOrder[level.trim().toLowerCase()] ?? Number.MAX_SAFE_INTEGER;
  }

  private loadAvailableCategories(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.syncCategoriesFromCourses(courses);
        this.buildCategoryGroups();
        this.updateCarouselButtonsSoon();
      },
      error: () => {
        this.categories = [];
      }
    });
  }

  private syncCategoriesFromCourses(courses: Course[]): void {
    const categoryNames = new Set(courses.map((course) => course.category));
    const categories = Array.from(categoryNames)
      .sort((a, b) => a.localeCompare(b))
      .map((categoryName, index) => ({
        id: index + 1,
        name: categoryName,
        description: `Courses about ${categoryName}.`,
        icon: this.getCategoryIcon(categoryName)
      } as Category));

    this.categories = categories;
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
