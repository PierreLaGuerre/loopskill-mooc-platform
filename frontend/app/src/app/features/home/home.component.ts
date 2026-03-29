import { Component } from '@angular/core';
import { PopularCoursesSectionComponent } from './components/popular-courses-section/popular-courses-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PopularCoursesSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}