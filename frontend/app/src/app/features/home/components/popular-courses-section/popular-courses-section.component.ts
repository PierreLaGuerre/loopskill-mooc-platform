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
import { CourseService } from '../../../../core/services/course.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';

const MIN_HOME_COURSES = 6;
const MAX_HOME_COURSES = 8;

@Component({
  selector: 'app-popular-courses-section',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './popular-courses-section.component.html',
  styleUrl: './popular-courses-section.component.scss'
})
export class PopularCoursesSectionComponent implements OnInit, AfterViewInit {
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);

  @ViewChild('coursesTrack')
  private coursesTrack?: ElementRef<HTMLElement>;

  popularCourses: Course[] = [];

  canScrollLeft = false;
  canScrollRight = false;

  ngOnInit(): void {
    this.popularCourses = this.getPopularCourses();
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

  private getPopularCourses(): Course[] {
    const courses = this.courseService.getCourses();
    const coursesById = new Map<number, Course>(
      courses.map((course) => [course.id, course])
    );
    const selectedCourseIds = new Set<number>();

    const rankedCourses = this.enrollmentService
      .getPopularCoursesByEnrollmentCount()
      .map((item) => coursesById.get(item.courseId) ?? null)
      .filter((course): course is Course => course != null)
      .slice(0, MAX_HOME_COURSES);

    rankedCourses.forEach((course) => {
      selectedCourseIds.add(course.id);
    });

    if (rankedCourses.length >= MIN_HOME_COURSES) {
      return rankedCourses;
    }

    const fallbackCourses = courses
      .filter((course) => selectedCourseIds.has(course.id) === false)
      .sort((a, b) => a.id - b.id)
      .slice(0, MIN_HOME_COURSES - rankedCourses.length);

    return [...rankedCourses, ...fallbackCourses];
  }
}
