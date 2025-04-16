// ✅ avatar-upload.component.ts
import {
  Component,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { environment } from "src/environments/environment";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-avatar-upload",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./avatar-upload.component.html",
  styleUrl: "./avatar-upload.component.scss",
})
export class AvatarUploadComponent {
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;
  @Output() avatarUpdated = new EventEmitter<string>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private http: HttpClient, private auth: AuthService) {}

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.errorMessage = null;
        this.successMessage = null;
        document.body.classList.add("show-preview");
      };
      reader.readAsDataURL(file);
    }
  }

  cancelPreview(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    this.errorMessage = null;
    this.successMessage = null;
    this.fileInput.nativeElement.value = "";
    document.body.classList.remove("show-preview");
  }

  onUploadClicked(): void {
    this.uploadAvatar();
  }

  uploadAvatar(): void {
    if (!this.selectedFile) {
      this.errorMessage = "❗ Файл не обрано";
      return;
    }

    const token = this.auth.getToken();
    const username = this.auth.getUsername();

    if (!token || !username) {
      this.errorMessage = "❗ Токен або імʼя користувача не знайдено";
      return;
    }

    const formData = new FormData();
    formData.append("avatar", this.selectedFile);
    formData.append("username", username);

    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);

    this.http
      .post<{ avatar: string }>(
        `${environment.apiUrl}/profile/avatar`,
        formData,
        { headers }
      )
      .subscribe({
        next: (res) => {
          this.avatarUpdated.emit(res.avatar);
          this.selectedFile = null;
          this.previewUrl = null;
          this.successMessage = "✅ Аватар успішно оновлено!";
          this.errorMessage = null;
          document.body.classList.remove("show-preview");

          // Показати повідомлення в popup (мобільна підтримка)
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (err) => {
          const backendMsg = err?.error?.message;
          this.errorMessage = backendMsg || "❌ Помилка формату зображення. Спробуйте інше.";
          this.successMessage = null;
        
          setTimeout(() => {
            this.errorMessage = null;
          }, 5000);
        },
      });
  }
}
