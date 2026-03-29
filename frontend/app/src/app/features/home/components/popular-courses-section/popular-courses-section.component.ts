import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../../../../shared/components/course-card/course-card.component';
import { MOCK_COURSES } from '../../../../core/mocks/mock-courses';

@Component({
  selector: 'app-popular-courses-section',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './popular-courses-section.component.html',
  styleUrl: './popular-courses-section.component.scss'
})
export class PopularCoursesSectionComponent {
  popularCourses = MOCK_COURSES.filter(course => course.isPopular).slice(0, 4);
}