import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CategoriesSectionComponent } from './categories-section.component';
import { CourseService } from '../../../../core/services/course.service';

describe('CategoriesSectionComponent', () => {
  let component: CategoriesSectionComponent;
  let fixture: ComponentFixture<CategoriesSectionComponent>;
  let courseService: jasmine.SpyObj<CourseService>;

  const apiCategories = [
    {
      id: 1,
      name: 'Programming',
      description: 'Build strong coding foundations with modern development skills.',
      icon: 'assets/images/categories/programming.png'
    },
    {
      id: 2,
      name: 'Databases',
      description: 'Learn to design, query and manage structured data efficiently.',
      icon: 'assets/images/categories/databases.png'
    }
  ];

  beforeEach(async () => {
    courseService = jasmine.createSpyObj<CourseService>('CourseService', {
      getCategories: of(apiCategories)
    });

    await TestBed.configureTestingModule({
      imports: [CategoriesSectionComponent],
      providers: [
        provideRouter([]),
        {
          provide: CourseService,
          useValue: courseService
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use categories from the API in their returned order', () => {
    expect(component.categories).toEqual(apiCategories);
  });
});
