import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { CoursePlayerComponent } from './course-player.component';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { Course } from '../../core/models/course.model';
import { Lesson } from '../../core/models/lesson.model';
import { User } from '../../core/models/user.model';
import { EnrollmentWithCourse } from '../../core/models/enrollment.model';

describe('CoursePlayerComponent', () => {
  let component: CoursePlayerComponent;
  let fixture: ComponentFixture<CoursePlayerComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let courseServiceSpy: jasmine.SpyObj<CourseService>;
  let enrollmentServiceSpy: jasmine.SpyObj<EnrollmentService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'student',
    clientType: 'student',
    planId: 1,
    interests: []
  };

  const mockCourse: Course = {
    id: 3,
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

  const mockLessons: Lesson[] = [
    {
      id: 1,
      courseId: mockCourse.id,
      title: 'Course overview',
      description: 'Course overview description.',
      duration: '00:07:00',
      videoUrl: 'assets/videos/lesson-1.mp4',
      displayOrder: 1
    },
    {
      id: 2,
      courseId: mockCourse.id,
      title: 'Project setup',
      description: 'Project setup description.',
      duration: '00:08:00',
      videoUrl: 'assets/videos/lesson-2.mp4',
      displayOrder: 2
    },
    {
      id: 3,
      courseId: mockCourse.id,
      title: 'Hands-on practice',
      description: 'Hands-on practice description.',
      duration: '00:09:00',
      videoUrl: 'assets/videos/lesson-3.mp4',
      displayOrder: 3
    }
  ];

  const mockEnrollment: EnrollmentWithCourse = {
    id: 1,
    userId: mockUser.id,
    courseId: mockCourse.id,
    progress: 20,
    enrolledAt: '2026-03-08T17:21:07',
    course: mockCourse
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser']);
    courseServiceSpy = jasmine.createSpyObj<CourseService>('CourseService', [
      'getCourseDetail'
    ]);
    enrollmentServiceSpy = jasmine.createSpyObj<EnrollmentService>('EnrollmentService', [
      'updateEnrollmentProgress'
    ]);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    courseServiceSpy.getCourseDetail.and.returnValue(of({
      course: mockCourse,
      outcomes: [],
      lessons: mockLessons,
      enrollment: mockEnrollment
    }));
    enrollmentServiceSpy.updateEnrollmentProgress.and.returnValue(of(mockEnrollment));

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
          provide: AuthService,
          useValue: authServiceSpy
        },
        {
          provide: CourseService,
          useValue: courseServiceSpy
        },
        {
          provide: EnrollmentService,
          useValue: enrollmentServiceSpy
        },
        {
          provide: Router,
          useValue: routerSpy
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

  it('should load completed lessons from enrollment progress', () => {
    expect(component.lessons[0].isCompleted).toBeTrue();
    expect(component.lessons[1].isCompleted).toBeTrue();
    expect(component.lessons[2].isCompleted).toBeFalse();
  });

  it('should select the first incomplete lesson by default when available', () => {
    expect(component.activeLesson).toEqual(component.lessons[2]);
    expect(component.activeVideoUrl).toBe('assets/videos/lesson-3.mp4');
  });

  it('should increase progress by 10 when a lesson checkbox is marked', () => {
    const event = new Event('click');
    spyOn(event, 'stopPropagation');

    component.toggleLessonCompleted(component.lessons[2], event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.lessons[2].isCompleted).toBeTrue();
    expect(enrollmentServiceSpy.updateEnrollmentProgress).toHaveBeenCalledWith(
      mockCourse.id,
      100
    );
  });

  it('should decrease progress by 10 when a lesson checkbox is unmarked', () => {
    const event = new Event('click');

    component.toggleLessonCompleted(component.lessons[1], event);

    expect(component.lessons[1].isCompleted).toBeFalse();
    expect(enrollmentServiceSpy.updateEnrollmentProgress).toHaveBeenCalledWith(
      mockCourse.id,
      33
    );
  });

  it('should not change the active lesson when toggling a checkbox', () => {
    const activeLesson = component.activeLesson;
    const event = new Event('click');

    component.toggleLessonCompleted(component.lessons[0], event);

    expect(component.activeLesson).toBe(activeLesson);
  });

  it('should handle courses without an enrollment', () => {
    courseServiceSpy.getCourseDetail.and.returnValue(of({
      course: mockCourse,
      outcomes: [],
      lessons: mockLessons,
      enrollment: null
    }));

    fixture = TestBed.createComponent(CoursePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/courses', mockCourse.id]);
  });

  it('should handle courses without lessons', () => {
    courseServiceSpy.getCourseDetail.and.returnValue(of({
      course: mockCourse,
      outcomes: [],
      lessons: [],
      enrollment: mockEnrollment
    }));

    fixture = TestBed.createComponent(CoursePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.lessons).toEqual([]);
    expect(component.activeLesson).toBeNull();
    expect(component.activeVideoUrl).toBe('assets/videos/loopskill-class-placeholder.mp4');
  });
});
