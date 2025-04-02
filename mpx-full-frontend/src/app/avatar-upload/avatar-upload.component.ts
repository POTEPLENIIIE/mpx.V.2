import {
  Component,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CommonModule } from "@angular/common";

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

  constructor(private http: HttpClient) {}

  triggerFileInput() {
    console.log("📁 Відкрито вибір файлу");
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
        console.log("📷 Превʼю готове:", this.previewUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  onUploadClicked(): void {
    console.log('⬆️ Кнопка "Завантажити" натиснута!');
    this.uploadAvatar();
  }

  cancelPreview(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    this.fileInput.nativeElement.value = ""; // 👈 очищаємо file input вручну
  }

  uploadAvatar(): void {
    if (!this.selectedFile) {
      alert("❗ Файл не обрано");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❗ Токен не знайдено");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", this.selectedFile);

    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);

    this.http
      .post<{ avatar: string }>(
        "http://localhost:4000/api/profile/avatar",
        formData,
        { headers }
      )
      .subscribe({
        next: (res) => {
          console.log("✅ Успіх:", res);
          this.avatarUpdated.emit(res.avatar);
          this.selectedFile = null;
          this.previewUrl = null;
        },
        error: (err) => {
          console.error("❌ Помилка при завантаженні:", err);
        },
      });
  }
}
