import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss'
})
export class CourseCardComponent {
  @Input() course!: Course;

  get planModifierClass(): string {
    const planName = this.course?.requiredPlan?.trim().toLowerCase();

    if (planName === 'free' || this.course?.requiredPlanId === 1) {
      return 'course-card__plan--free';
    }

    if (planName === 'pro' || this.course?.requiredPlanId === 2) {
      return 'course-card__plan--pro';
    }

    if (planName === 'premium' || this.course?.requiredPlanId === 3) {
      return 'course-card__plan--premium';
    }

    return 'course-card__plan--free';
  }
}
