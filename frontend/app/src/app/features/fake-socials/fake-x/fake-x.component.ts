import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-fake-x',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fake-x.component.html',
  styleUrl: './fake-x.component.scss'
})
export class FakeXComponent {}
