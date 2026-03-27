import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { PlansComponent } from './features/plans/plans.component';
import { UserPageComponent } from './features/user-page/user-page.component';
import { CourseDetailComponent } from './features/course-detail/course-detail.component';
import { ExploreComponent } from './features/explore/explore.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'login', component: LoginComponent },
  { path: 'plans', component: PlansComponent },
  { path: 'user', component: UserPageComponent },
  { path: 'courses/:id', component: CourseDetailComponent },
  { path: '**', redirectTo: '' }
];