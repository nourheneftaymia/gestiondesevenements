import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashbordSuperieurHeararchiqueComponent } from "./components/dashbord-superieur-heararchique/dashbord-superieur-heararchique.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, DashbordSuperieurHeararchiqueComponent ],
    templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Modernize Angular Admin Tempplate';
}
