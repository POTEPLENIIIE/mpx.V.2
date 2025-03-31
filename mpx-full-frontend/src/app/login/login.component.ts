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

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [
    NavbarComponent,
    ReactiveFormsModule,
    FooterComponent,
    CommonModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  toastMessage: string | null = null;
  toastType: "success" | "error" = "success"; // Тип для повідомлення
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ["", [Validators.required]], // Замінили email на usernameOrEmail
      password: ["", Validators.required],
    });
  }

  get usernameOrEmail(): AbstractControl | null {
    return this.loginForm.get("usernameOrEmail");
  }
  get password(): AbstractControl | null {
    return this.loginForm.get("password");
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Функція для показу toast
  showToast(message: string, type: "success" | "error" = "success") {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }

  // Функція для логіну
  login(): void {
    const { usernameOrEmail, password } = this.loginForm.value;

    this.AuthService.login({ usernameOrEmail, password }).subscribe({
      next: (res) => {
        localStorage.setItem("token", res.token);
        this.showToast("Успішна авторизація!", "success"); // Показуємо успіх
        setTimeout(() => {
          this.router.navigate(["/profile"]); // Перенаправлення на dashboard
        }, 1000); // Пауза для показу повідомлення
      },
      error: (err) => {
        this.showToast("Невідома помилка", "error"); // Показуємо помилку
        console.error(err);
      },
    });
  }
}
