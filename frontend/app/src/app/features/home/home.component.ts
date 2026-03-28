import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';
import { MOCK_COURSES } from '../../core/mocks/mock-courses';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  popularCourses = MOCK_COURSES.filter(course => course.isPopular).slice(0, 4);
}