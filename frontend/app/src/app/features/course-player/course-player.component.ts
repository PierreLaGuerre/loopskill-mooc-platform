import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course } from '../../core/models/course.model';
import { Lesson } from '../../core/models/lesson.model';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';

export interface CoursePlayerLesson extends Lesson {
  durationLabel: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-player.component.html',
  styleUrl: './course-player.component.scss'
})
export class CoursePlayerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private readonly fallbackVideoUrl = 'assets/videos/loopskill-class-placeholder.mp4';

  user: User | null = null;
  course: Course | null = null;
  lessons: CoursePlayerLesson[] = [];
  activeLesson: CoursePlayerLesson | null = null;
  activeVideoUrl = this.fallbackVideoUrl;
  activeLessonTitle = '';
  activeLessonDescription = '';
  isLoading: boolean = true;

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    const courseIdParam = this.route.snapshot.paramMap.get('id');

    if (courseIdParam != null) {
      const courseId = Number(courseIdParam);
      this.courseService.getCourseDetail(courseId).subscribe({
        next: (detail) => {
          if (detail.enrollment == null) {
            this.router.navigate(['/courses', courseId]);
            return;
          }

          this.course = detail.course;
          this.lessons = this.buildCoursePlayerLessons(detail.lessons, detail.enrollment.progress);
          this.activeLesson = this.lessons.find((lesson) => lesson.isCompleted === false)
            ?? this.lessons[0]
            ?? null;
          this.updateActiveLessonView(this.activeLesson);
          this.isLoading = false;
        },
        error: () => {
          this.course = null;
          this.lessons = [];
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  public selectLesson(lesson: CoursePlayerLesson): void {
    this.activeLesson = lesson;
    this.updateActiveLessonView(lesson);
  }

  public toggleLessonCompleted(lesson: CoursePlayerLesson, event: Event): void {
    event.stopPropagation();
    lesson.isCompleted = !lesson.isCompleted;
    this.saveCurrentProgress();
  }

  private buildCoursePlayerLessons(lessons: Lesson[], progress: number): CoursePlayerLesson[] {
    const completedLessonsCount = Math.floor(progress / 10);

    return lessons.map((lesson) => ({
      ...lesson,
      durationLabel: this.formatDuration(lesson.duration),
      isCompleted: lesson.displayOrder <= completedLessonsCount
    }));
  }

  private formatDuration(duration: string | null): string {
    if (duration == null) {
      return '00:00';
    }

    const durationParts = duration.split(':');

    if (durationParts.length === 3) {
      return `${durationParts[1]}:${durationParts[2]}`;
    }

    return duration;
  }

  private getLessonVideoUrl(lesson: CoursePlayerLesson | null): string {
    return lesson?.videoUrl ?? this.fallbackVideoUrl;
  }

  private updateActiveLessonView(lesson: CoursePlayerLesson | null): void {
    this.activeLessonTitle = lesson?.title ?? '';
    this.activeLessonDescription = lesson?.description ?? this.course?.description ?? '';
    this.activeVideoUrl = this.getLessonVideoUrl(lesson);
  }

  private saveCurrentProgress(): void {
    if (this.user == null || this.course == null) {
      return;
    }

    const completedLessonsCount = this.lessons.filter((lesson) => lesson.isCompleted).length;
    const progress = this.lessons.length === 0
      ? 0
      : Math.round((completedLessonsCount / this.lessons.length) * 100);

    this.enrollmentService.updateEnrollmentProgress(this.course.id, progress).subscribe();
  }
}
