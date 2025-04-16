import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
})
export class NavbarComponent {
  constructor(private router: Router, public authService: AuthService) {}

  menuOpen: boolean = false;
  navigateHome(): void {
    window.location.href = "https://minecraftprojectx.com/home";
  }
  
  to_settings(event: Event) {
    event.preventDefault();
    this.router.navigate(["/settings"]);
  }
  to_home(event: Event) {
    event.preventDefault();
    this.router.navigate(["/home"]);
  }
  to_dashboard(event: Event) {
    event.preventDefault();
  }
  exit(event: Event) {
    localStorage.removeItem("token");
    this.router.navigate(["/"]);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }
}
