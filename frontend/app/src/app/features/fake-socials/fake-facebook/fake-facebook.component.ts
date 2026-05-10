import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-fake-facebook',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fake-facebook.component.html',
  styleUrl: './fake-facebook.component.scss'
})
export class FakeFacebookComponent {}
