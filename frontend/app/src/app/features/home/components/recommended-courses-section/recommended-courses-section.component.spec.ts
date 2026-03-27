import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedCoursesSectionComponent } from './recommended-courses-section.component';

describe('RecommendedCoursesSectionComponent', () => {
  let component: RecommendedCoursesSectionComponent;
  let fixture: ComponentFixture<RecommendedCoursesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedCoursesSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecommendedCoursesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
