import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { AvatarUploadComponent } from "../avatar-upload/avatar-upload.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from "@angular/common";
import { environment } from 'src/environments/environment';

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
  toastTimeout: any;
  environment = environment;
  isLoading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserData();
  }

  onAvatarLoadError(): void {
    this.userData.avatar = 'default-avatar.webp';
    this.now = Date.now();
  }

getUserData(): void {
  this.userService.getUserProfile().subscribe({
    next: (data) => {
      this.userData = {
        ...data,
        avatar: data.avatar || 'default-avatar.webp',
      };
      this.now = Date.now();
      this.isLoading = false;
    },
    error: (err) => {
      console.error("❌ Помилка отримання:", err);
      this.errorMessage = "Не вдалося отримати дані профілю.";
      this.isLoading = false;
    },
  });
}

  handleAvatarUpdate(newAvatarFilename: string): void {
    this.userData.avatar = newAvatarFilename;
    this.now = Date.now();
    this.showToast("Аватар оновлено успішно!", "success");
  }

  showToast(message: string, type: string): void {
    this.toastMessage = message;
    this.toastType = type;
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = "";
      this.toastType = "";
    }, 4000);
  }

  resendEmail(): void {
    this.userService.resendVerificationEmail(this.userData.email).subscribe({
      next: () => {
        this.showToast("Лист на підтвердження надіслано повторно", "success");
      },
      error: () => {
        this.showToast("Помилка при надсиланні листа", "error");
      }
    });
  }
  
}
