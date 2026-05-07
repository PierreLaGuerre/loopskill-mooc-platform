import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseCardComponent } from '../../../../shared/components/course-card/course-card.component';

import { Course } from '../../../../core/models/course.model';
import { User } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CourseService } from '../../../../core/services/course.service';

@Component({
  selector: 'app-recommended-courses-section',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './recommended-courses-section.component.html',
  styleUrl: './recommended-courses-section.component.scss'
})
export class RecommendedCoursesSectionComponent implements OnInit, AfterViewInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);

  @ViewChild('coursesTrack')
  private coursesTrack?: ElementRef<HTMLElement>;

  currentUser: User | null = null;
  recommendedCourses: Course[] = [];
  canScrollLeft = false;
  canScrollRight = false;

  ngOnInit(): void {
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.currentUser = user;
      this.loadRecommendedCourses();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateScrollButtons();
    });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateScrollButtons();
  }

  scrollCourses(direction: 'left' | 'right'): void {
    const track = this.coursesTrack?.nativeElement;

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
  }

  updateScrollButtons(): void {
    const track = this.coursesTrack?.nativeElement;

    if (track == null) {
      return;
    }

    const maxScrollLeft = track.scrollWidth - track.clientWidth;

    this.canScrollLeft = track.scrollLeft > 0;
    this.canScrollRight = track.scrollLeft < maxScrollLeft - 1;
  }

  private loadRecommendedCourses(): void {
    const courses$ = this.currentUser == null
      ? this.courseService.getPopularCourses()
      : this.courseService.getRecommendedCourses();

    courses$.subscribe({
      next: (courses) => {
        this.recommendedCourses = courses;
        setTimeout(() => this.updateScrollButtons());
      },
      error: () => {
        this.recommendedCourses = [];
      }
    });
  }
}
