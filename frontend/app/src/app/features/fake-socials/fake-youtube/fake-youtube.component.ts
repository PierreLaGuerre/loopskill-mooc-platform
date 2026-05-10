import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-fake-youtube',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fake-youtube.component.html',
  styleUrl: './fake-youtube.component.scss'
})
export class FakeYoutubeComponent {}
