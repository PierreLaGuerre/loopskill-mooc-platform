import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AuthComponent } from './features/auth/auth.component';
import { PlansComponent } from './features/plans/plans.component';
import { UserPageComponent } from './features/user-page/user-page.component';
import { CourseDetailComponent } from './features/course-detail/course-detail.component';
import { ExploreComponent } from './features/explore/explore.component';
import { InterestsOnboardingComponent } from './features/onboarding/interests-onboarding/interests-onboarding.component';
import { SettingsComponent } from './features/settings/settings.component';
import { CoursePlayerComponent } from './features/course-player/course-player.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'onboarding/interests', component: InterestsOnboardingComponent },
  { path: 'home', component: HomeComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'plans', component: PlansComponent },
  { path: 'my-learning', component: UserPageComponent },
  { path: 'profile', component: UserPageComponent },
  { path: 'courses/:id/learn', component: CoursePlayerComponent },
  { path: 'courses/:id', component: CourseDetailComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: 'auth' }
];
