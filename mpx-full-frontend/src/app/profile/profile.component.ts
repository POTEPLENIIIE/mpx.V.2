import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { AvatarUploadComponent } from "../avatar-upload/avatar-upload.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    AvatarUploadComponent,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent implements OnInit {
  userData: any = {};
  now: number = Date.now();
  errorMessage = "";
  toastMessage = "";
  toastType = "";

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        console.log("🟢 Нові дані:", data);
        this.userData = JSON.parse(JSON.stringify(data)); // форсує зміну референсу
        this.now = Date.now();
      },
      error: (err) => {
        console.error("❌ Помилка отримання:", err);
        this.errorMessage = "Не вдалося отримати дані профілю.";
      },
    });
  }
  handleAvatarUpdate(newAvatarFilename: string): void {
    this.userData.avatar = newAvatarFilename; // ⚡ оновлюємо вручну
    this.now = Date.now(); // 🔁 кеш-байпас
  }
}
