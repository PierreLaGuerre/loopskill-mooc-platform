import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CategoryCardComponent } from './category-card.component';
import { Category } from '../../../core/models/category.model';

describe('CategoryCardComponent', () => {
  let component: CategoryCardComponent;
  let fixture: ComponentFixture<CategoryCardComponent>;
  const category: Category = {
    id: 1,
    name: 'Programming',
    description: 'Build practical coding skills.',
    icon: 'assets/images/categories/programming.png'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCardComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryCardComponent);
    component = fixture.componentInstance;
    component.category = category;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
