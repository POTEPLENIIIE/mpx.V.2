import { Component } from "@angular/core";
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: "app-payments",
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: "./payments.component.html",
  styleUrl: "./payments.component.css",
})
export class PaymentsComponent {}
