import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  hideLayout: boolean = false;

  constructor() {
    this.restoreUserSession();
    this.updateLayoutVisibility(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateLayoutVisibility(this.router.url);
      });
  }

  private restoreUserSession(): void {
    if (this.authService.getToken() == null) {
      return;
    }

    this.authService.loadCurrentUserFromToken().subscribe({
      next: () => {},
      error: () => {}
    });
  }

  private updateLayoutVisibility(url: string): void {
    if (
      url.startsWith('/auth') ||
      url.startsWith('/onboarding') ||
      url.startsWith('/loopskill-facebook') ||
      url.startsWith('/loopskill-instagram') ||
      url.startsWith('/loopskill-linkedin') ||
      url.startsWith('/loopskill-x') ||
      url.startsWith('/loopskill-youtube')
    ) {
      this.hideLayout = true;
    } else {
      this.hideLayout = false;
    }
  }
}
