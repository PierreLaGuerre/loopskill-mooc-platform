import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularCoursesSectionComponent } from './popular-courses-section.component';

describe('PopularCoursesSectionComponent', () => {
  let component: PopularCoursesSectionComponent;
  let fixture: ComponentFixture<PopularCoursesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularCoursesSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopularCoursesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
