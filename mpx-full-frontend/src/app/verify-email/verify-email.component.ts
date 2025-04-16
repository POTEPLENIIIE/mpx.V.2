import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  template: `
    <div class="verify-wrapper">
      <div class="verify-card">
        <div class="status-icon" *ngIf="success">✅</div>
        <div class="status-icon" *ngIf="!success">❌</div>
        <h2>{{ message }}</h2>
        <a class="home-link" href="/">⬅️ На головну</a>
      </div>
    </div>
  `,
  styles: [`
    .verify-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #2A2B38, #1B1C26);
    }

    .verify-card {
      background-color: #2a2b38;
      border-radius: 20px;
      padding: 40px;
      color: white;
      text-align: center;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 100%;
    }

    .status-icon {
      font-size: 40px;
      margin-bottom: 15px;
    }

    .home-link {
      display: inline-block;
      margin-top: 20px;
      color: #3F5FFF;
      text-decoration: none;
      font-weight: bold;
    }

    .home-link:hover {
      text-decoration: underline;
    }
  `]
})
export class VerifyEmailComponent implements OnInit {
  message = 'Перевірка...';
  success = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.http.get(`/api/auth/verify-email?token=${token}`).subscribe({
        next: () => {
          this.message = '✅ Пошта успішно підтверджена!';
          this.success = true;

          // ⏳ Авто-редірект через 5 секунд
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 5000);
        },
        error: () => {
          this.message = '❌ Посилання недійсне або термін дії вичерпано.';
          this.success = false;
        },
      });
    } else {
      this.message = '❌ Токен не вказано.';
      this.success = false;
    }
  }
}
