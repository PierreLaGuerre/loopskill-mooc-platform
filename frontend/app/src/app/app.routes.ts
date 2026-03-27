import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { PlansComponent } from './features/plans/plans.component';
import { CourseDetailComponent } from './features/course-detail/course-detail.component';
import { LoginComponent } from './features/login/login.component';
import { UserPageComponent } from './features/user-page/user-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'explore', component: HomeComponent },
  { path: 'my-learnings', component: UserPageComponent },
  { path: 'plans', component: PlansComponent },
  { path: 'profile', component: UserPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'courses/:id', component: CourseDetailComponent },
  { path: '**', redirectTo: '' }
];