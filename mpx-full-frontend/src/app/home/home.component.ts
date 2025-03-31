import { Component } from "@angular/core";
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { ServersComponent } from "../servers/servers.component";
@Component({
  selector: "app-home",
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ServersComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {}
