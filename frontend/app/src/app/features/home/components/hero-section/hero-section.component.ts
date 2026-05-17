import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { User } from '../../../../core/models/user.model';
import { Course } from '../../../../core/models/course.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CourseService } from '../../../../core/services/course.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { EnrollmentWithCourse } from '../../../../core/models/enrollment.model';

interface FeaturedHeroConfig {
  courseId: number;
  image: string;
  background: string;
  accent: string;
}

interface FeaturedHeroSlide extends FeaturedHeroConfig {
  course: Course;
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private carouselIntervalId: number | null = null;

  private readonly carouselDelay = 3600;
  private readonly featuredHeroConfigs: FeaturedHeroConfig[] = [
    {
      courseId: 9,
      image: 'assets/images/carrusel/cloud.webp',
      background: '#063345',
      accent: '#34d6f3'
    },
    {
      courseId: 13,
      image: 'assets/images/carrusel/data-science.jpeg',
      background: '#12172f',
      accent: '#7dd3fc'
    },
    {
      courseId: 15,
      image: 'assets/images/carrusel/machine-learning.jpg',
      background: '#211a3d',
      accent: '#ff8a5c'
    },
    {
      courseId: 1,
      image: 'assets/images/carrusel/python.png',
      background: '#102b3b',
      accent: '#b6f24a'
    },
    {
      courseId: 12,
      image: 'assets/images/carrusel/docker-kubernetes.jpg',
      background: '#073b48',
      accent: '#46e6df'
    },
    {
      courseId: 18,
      image: 'assets/images/carrusel/linux.jpg',
      background: '#39214f',
      accent: '#f472d0'
    }
  ];

  user: User | null = null;
  currentEnrollment: EnrollmentWithCourse | null = null;
  currentCourse: Course | null = null;
  isLoadingHeroData: boolean = true;
  featuredSlides: FeaturedHeroSlide[] = [];
  activeSlideIndex = 0;

  ngOnInit(): void {
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.user = user;
      this.loadHeroData();
    });
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  private loadHeroData(): void {
    if (this.user == null) {
      this.currentEnrollment = null;
      this.currentCourse = null;
      this.loadFeaturedSlides();
      return;
    }

    this.isLoadingHeroData = true;

    this.enrollmentService.getMyInProgressEnrollments().subscribe({
      next: (enrollments) => {
        this.currentEnrollment = enrollments
          .sort((a, b) => b.progress - a.progress)[0] || null;
        this.currentCourse = this.currentEnrollment?.course ?? null;

        if (this.currentEnrollment == null) {
          this.loadFeaturedSlides();
          return;
        }

        this.stopCarousel();
        this.isLoadingHeroData = false;
      },
      error: () => {
        this.currentEnrollment = null;
        this.currentCourse = null;
        this.loadFeaturedSlides();
      }
    });
  }

  private loadFeaturedSlides(): void {
    this.isLoadingHeroData = true;

    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.featuredSlides = this.featuredHeroConfigs
          .map((config) => {
            const course = courses.find((currentCourse) => currentCourse.id === config.courseId);

            return course == null
              ? null
              : {
                  ...config,
                  course
                };
          })
          .filter((slide): slide is FeaturedHeroSlide => slide != null);

        this.activeSlideIndex = 0;
        this.isLoadingHeroData = false;
        this.startCarousel();
      },
      error: () => {
        this.featuredSlides = [];
        this.isLoadingHeroData = false;
      }
    });
  }

  get activeSlide(): FeaturedHeroSlide | null {
    return this.featuredSlides[this.activeSlideIndex] ?? null;
  }

  showSlide(index: number): void {
    if (this.featuredSlides.length === 0) {
      return;
    }

    this.activeSlideIndex = index;
    this.restartCarousel();
  }

  showPreviousSlide(): void {
    if (this.featuredSlides.length === 0) {
      return;
    }

    this.activeSlideIndex =
      this.activeSlideIndex === 0 ? this.featuredSlides.length - 1 : this.activeSlideIndex - 1;
    this.restartCarousel();
  }

  showNextSlide(): void {
    if (this.featuredSlides.length === 0) {
      return;
    }

    this.activeSlideIndex = (this.activeSlideIndex + 1) % this.featuredSlides.length;
    this.restartCarousel();
  }

  pauseCarousel(): void {
    this.stopCarousel();
  }

  resumeCarousel(): void {
    this.startCarousel();
  }

  useCourseImageFallback(event: Event, course: Course): void {
    const image = event.target as HTMLImageElement;

    if (image.src.endsWith(course.image)) {
      return;
    }

    image.src = course.image;
  }

  private startCarousel(): void {
    this.stopCarousel();

    if (this.featuredSlides.length <= 1) {
      return;
    }

    this.carouselIntervalId = window.setInterval(() => {
      this.activeSlideIndex = (this.activeSlideIndex + 1) % this.featuredSlides.length;
    }, this.carouselDelay);
  }

  private restartCarousel(): void {
    this.startCarousel();
  }

  private stopCarousel(): void {
    if (this.carouselIntervalId == null) {
      return;
    }

    window.clearInterval(this.carouselIntervalId);
    this.carouselIntervalId = null;
  }
}
