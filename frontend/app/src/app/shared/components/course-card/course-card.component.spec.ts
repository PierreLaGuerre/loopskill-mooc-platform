import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CourseCardComponent } from './course-card.component';
import { Course } from '../../../core/models/course.model';

describe('CourseCardComponent', () => {
  let component: CourseCardComponent;
  let fixture: ComponentFixture<CourseCardComponent>;
  let course: Course;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseCardComponent);
    component = fixture.componentInstance;
    course = {
      id: 1,
      title: 'Python Fundamentals',
      description: 'Learn Python from scratch.',
      category: 'Programming',
      level: 'Beginner',
      requiredPlan: 'Free',
      requiredPlanId: 1,
      image: 'assets/images/courses/python.png',
      tags: ['python'],
      isPopular: true,
      instructor: 'Laura Bennett',
      durationHours: 18,
      lessonsCount: 42
    };
    component.course = course;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the free plan badge style', () => {
    const planBadge = fixture.debugElement.query(By.css('.course-card__plan'));

    expect(planBadge.nativeElement.classList).toContain('course-card__plan--free');
  });

  it('should apply the premium plan badge style', () => {
    component.course = { ...course, requiredPlan: 'Premium', requiredPlanId: 3 };
    fixture.detectChanges();

    const planBadge = fixture.debugElement.query(By.css('.course-card__plan'));

    expect(planBadge.nativeElement.classList).toContain('course-card__plan--premium');
  });
});
