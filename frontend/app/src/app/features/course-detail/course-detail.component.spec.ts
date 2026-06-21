import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ParamMap, Router, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { CourseDetailComponent } from './course-detail.component';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { PaymentService } from '../../core/services/payment.service';

describe('CourseDetailComponent', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;
  let routeParamMap$: BehaviorSubject<ParamMap>;
  let courseService: jasmine.SpyObj<CourseService>;

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
    routeParamMap$ = new BehaviorSubject(convertToParamMap({ id: String(mockCourse.id) }));
    courseService = jasmine.createSpyObj<CourseService>('CourseService', {
      getCourseDetail: of({
        course: mockCourse,
        outcomes: [],
        lessons: [],
        enrollment: null
      })
    });

    await TestBed.configureTestingModule({
      imports: [CourseDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: routeParamMap$.asObservable(),
            snapshot: {
              paramMap: convertToParamMap({ id: String(mockCourse.id) }),
              queryParamMap: convertToParamMap({})
            }
          }
        },
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj<AuthService>('AuthService', {
            getCurrentUser: null
          })
        },
        {
          provide: CourseService,
          useValue: courseService
        },
        {
          provide: EnrollmentService,
          useValue: jasmine.createSpyObj<EnrollmentService>('EnrollmentService', ['createEnrollment'])
        },
        {
          provide: PaymentService,
          useValue: jasmine.createSpyObj<PaymentService>('PaymentService', [
            'createCourseCheckout',
            'redirectToCheckout'
          ])
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

  it('should reload course detail when the route course id changes', () => {
    expect(courseService.getCourseDetail).toHaveBeenCalledWith(mockCourse.id);

    courseService.getCourseDetail.calls.reset();
    routeParamMap$.next(convertToParamMap({ id: '2' }));

    expect(courseService.getCourseDetail).toHaveBeenCalledWith(2);
  });
});
