import { Component, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
})
export class NavbarComponent {
  menuOpen: boolean = false;

  constructor(private router: Router, public authService: AuthService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  @HostListener("document:click", ["$event"])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".container")) {
      this.closeMenu();
    }
  }

  to_settings(event: Event) {
    event.preventDefault();
    this.router.navigate(["/settings"]);
    this.closeMenu();
  }

  to_home(event: Event) {
    event.preventDefault();
    this.router.navigate(["/home"]);
    this.closeMenu();
  }

  to_dashboard(event: Event) {
    event.preventDefault();
    this.router.navigate(["/profile"]);
    this.closeMenu();
  }

  exit(event: Event) {
    event.preventDefault();
    localStorage.removeItem("token");
    this.router.navigate(["/"]);
    this.closeMenu();
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
    this.closeMenu();
  }
}
