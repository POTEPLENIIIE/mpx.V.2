import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterModule } from "@angular/router";
@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  registerForm: FormGroup;

  showPassword = false;
  showConfirmPassword = false;

  toastMessage: string | null = null;
  toastType: "success" | "error" = "success";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        username: [
          "", 
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern('^[a-zA-Z0-9_-]+$') // ❗️тільки латиниця, цифри, _ та -
          ]
        ],
        email: [
          "", 
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
          ]
        ],
        password: [
          "", 
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{6,}$') // хоча б літера і цифра
          ]
        ],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );    
  }

  // Геттери для зручного доступу
  get username(): AbstractControl | null {
    return this.registerForm.get("username");
  }

  get email(): AbstractControl | null {
    return this.registerForm.get("email");
  }

  get password(): AbstractControl | null {
    return this.registerForm.get("password");
  }

  get confirmPassword(): AbstractControl | null {
    return this.registerForm.get("confirmPassword");
  }

  // Перемикачі паролю
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Перевірка на збіг паролів
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get("password")?.value;
    const confirm = form.get("confirmPassword")?.value;
    return password === confirm ? null : { mismatch: true };
  }

  // Кастомний toast
  showToast(message: string, type: "success" | "error" = "success") {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }

  // Сабміт
  onSubmit(): void {
    if (this.registerForm.valid) {
      const raw = this.registerForm.value;

      const formData = {
        username: raw.username.trim(),
        email: raw.email.trim().toLowerCase(),
        password: raw.password,
      };

      this.authService.register(formData).subscribe({
        next: () => {
          this.showToast("На вашу пошту надіслано лист для підтвердження!", "success");
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500);

        },
        error: (err) => {
          console.error(err);
          this.showToast(err.error?.message || "Помилка реєстрації", "error");
        },
      });
    }
  }
}
