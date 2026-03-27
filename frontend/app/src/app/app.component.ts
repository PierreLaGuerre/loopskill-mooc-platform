import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavebarComponent } from "./core/layout/navebar/navebar.component";
import { FooterComponent } from "./core/layout/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavebarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app';
}
