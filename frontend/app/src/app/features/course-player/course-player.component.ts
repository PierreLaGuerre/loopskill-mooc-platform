import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Course } from '../../core/models/course.model';
import { CourseService } from '../../core/services/course.service';

interface CourseLesson {
  id: number;
  title: string;
  duration: string;
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
  private courseService = inject(CourseService);

  course: Course | null = null;
  lessons: CourseLesson[] = [];
  activeLesson: CourseLesson | null = null;

  ngOnInit(): void {
    const courseIdParam = this.route.snapshot.paramMap.get('id');

    if (courseIdParam != null) {
      const courseId = Number(courseIdParam);
      this.course = this.courseService.getCourseById(courseId);

      if (this.course != null) {
        this.lessons = this.buildPlaceholderLessons(this.course);
        this.activeLesson = this.lessons.length > 2 ? this.lessons[2] : this.lessons[0] ?? null;
      }
    }
  }

  selectLesson(lesson: CourseLesson): void {
    this.activeLesson = lesson;
  }

  private buildPlaceholderLessons(course: Course): CourseLesson[] {
    return [
      {
        id: 1,
        title: `${course.title} - Welcome`,
        duration: '05:12',
        isCompleted: true
      },
      {
        id: 2,
        title: 'Core concepts and setup',
        duration: '08:45',
        isCompleted: true
      },
      {
        id: 3,
        title: 'Hands-on practice',
        duration: '11:20',
        isCompleted: false
      },
      {
        id: 4,
        title: 'Project walkthrough',
        duration: '09:10',
        isCompleted: false
      },
      {
        id: 5,
        title: 'Wrap-up and next steps',
        duration: '06:30',
        isCompleted: false
      }
    ];
  }
}
