import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { CourseDetailComponent } from './course-detail.component';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';

describe('CourseDetailComponent', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;

  const mockCourse = {
    id: 1,
    title: 'Angular Fundamentals',
    description: 'Course description',
    category: 'Programming',
    level: 'Beginner',
    requiredPlan: 'Free',
    image: 'assets/images/courses/angular.png',
    tags: ['angular'],
    isPopular: true,
    instructor: 'LoopSkill',
    durationHours: 5,
    lessonsCount: 3
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetailComponent],
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
          provide: Router,
          useValue: jasmine.createSpyObj<Router>('Router', ['navigate', 'navigateByUrl'])
        },
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj<AuthService>('AuthService', {
            getCurrentUser: null
          })
        },
        {
          provide: CourseService,
          useValue: jasmine.createSpyObj<CourseService>('CourseService', {
            getCourseDetail: of({
              course: mockCourse,
              outcomes: [],
              lessons: [],
              enrollment: null
            })
          })
        },
        {
          provide: EnrollmentService,
          useValue: jasmine.createSpyObj<EnrollmentService>('EnrollmentService', ['createEnrollment'])
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
