import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../../../../shared/components/course-card/course-card.component';
import { MOCK_COURSES } from '../../../../core/mocks/mock-courses';

const MAX_HOME_COURSES = 8;

@Component({
  selector: 'app-popular-courses-section',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './popular-courses-section.component.html',
  styleUrl: './popular-courses-section.component.scss'
})
export class PopularCoursesSectionComponent implements AfterViewInit {
  @ViewChild('coursesTrack')
  private coursesTrack?: ElementRef<HTMLElement>;

  popularCourses = MOCK_COURSES
    .filter((course) => course.isPopular)
    .slice(0, MAX_HOME_COURSES);

  canScrollLeft = false;
  canScrollRight = false;

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
}
