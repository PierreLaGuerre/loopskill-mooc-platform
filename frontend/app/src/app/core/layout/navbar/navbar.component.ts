import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MOCK_USER } from '../../mocks/mock-user';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  userInitial: string = MOCK_USER.name.charAt(0).toUpperCase();
}