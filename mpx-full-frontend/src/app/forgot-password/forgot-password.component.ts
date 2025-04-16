import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FooterComponent,
    NavbarComponent,
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  message = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.http.post('/api/auth/request-reset', this.form.value).subscribe({
      next: () => {
        this.message = '✅ Посилання на зміну паролю надіслано на вашу пошту';
        this.isLoading = false;
      },
      error: () => {
        this.message = '❌ Помилка при надсиланні листа';
        this.isLoading = false;
      }
    });
  }
}
