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
import { FakeFacebookComponent } from './features/fake-socials/fake-facebook/fake-facebook.component';
import { FakeInstagramComponent } from './features/fake-socials/fake-instagram/fake-instagram.component';
import { FakeLinkedinComponent } from './features/fake-socials/fake-linkedin/fake-linkedin.component';
import { FakeXComponent } from './features/fake-socials/fake-x/fake-x.component';
import { FakeYoutubeComponent } from './features/fake-socials/fake-youtube/fake-youtube.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'loopskill-facebook', component: FakeFacebookComponent },
  { path: 'loopskill-instagram', component: FakeInstagramComponent },
  { path: 'loopskill-linkedin', component: FakeLinkedinComponent },
  { path: 'loopskill-x', component: FakeXComponent },
  { path: 'loopskill-youtube', component: FakeYoutubeComponent },

  {
    path: 'onboarding/interests',
    component: InterestsOnboardingComponent,
    canActivate: [authGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'explore',
    component: ExploreComponent,
    canActivate: [authGuard]
  },
  {
    path: 'plans',
    component: PlansComponent,
    canActivate: [authGuard]
  },
  {
    path: 'my-learning',
    component: UserPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: UserPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'courses/:id/learn',
    component: CoursePlayerComponent,
    canActivate: [authGuard]
  },
  {
    path: 'courses/:id',
    component: CourseDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: 'auth' }
];
