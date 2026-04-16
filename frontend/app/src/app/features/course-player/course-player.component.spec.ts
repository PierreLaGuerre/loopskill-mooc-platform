import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { CoursePlayerComponent } from './course-player.component';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';

describe('CoursePlayerComponent', () => {
  let component: CoursePlayerComponent;
  let fixture: ComponentFixture<CoursePlayerComponent>;

  const mockCourse: Course = {
    id: 1,
    title: 'Angular Fundamentals',
    description: 'Placeholder course description.',
    category: 'Development',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/angular-course.jpg',
    tags: ['angular'],
    isPopular: true,
    instructor: 'Jane Doe',
    durationHours: 4,
    lessonsCount: 5
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePlayerComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: String(mockCourse.id) })
            }
          }
        },
        {
          provide: CourseService,
          useValue: {
            getCourseById: jasmine.createSpy('getCourseById').and.returnValue(mockCourse)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select the third placeholder lesson by default', () => {
    expect(component.activeLesson).toEqual(component.lessons[2]);
  });
});
