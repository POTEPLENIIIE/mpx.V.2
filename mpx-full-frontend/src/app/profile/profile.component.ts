import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { UserService } from "../services/user.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent implements OnInit {
  userData: any = {};
  errorMessage: string = "";

  toastMessage: string = "";
  toastType: string = "";

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log("ТОКЕН:", localStorage.getItem("token"));
    this.getUserData();
  }

  getUserData() {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        console.log("Отримані дані користувача:", data);
        this.userData = data;
        this.cdr.detectChanges(); // 🧠 примусове оновлення DOM
      },
      error: (error) => {
        console.error("Помилка отримання даних:", error);
        this.errorMessage = "Не вдалося завантажити дані користувача.";
      },
    });
  }
}
