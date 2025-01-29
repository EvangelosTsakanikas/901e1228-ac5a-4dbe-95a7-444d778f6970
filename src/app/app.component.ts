import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from "./Components/navigation-bar/navigation-bar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = '901e1228-ac5a-4dbe-95a7-444d778f6970';
}
