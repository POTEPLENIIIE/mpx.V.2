// src/app/services/auth.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  register(data: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(credentials: { usernameOrEmail: string; password: string }): Observable<any> {
    console.log("➡️ credentials:", credentials);
    return this.http.post(`${this.apiUrl}/login`, {
      usernameOrEmail: credentials.usernameOrEmail,
      password: credentials.password
    }, {
      withCredentials: true
    }).pipe(
      tap({
        next: (response: any) => {
          console.log('✅ Login success:', response);
          localStorage.setItem("token", response.token);
  
          if (response.username) {
            localStorage.setItem("username", response.username);
          } else {
            console.warn("⚠️ У відповіді немає username!");
          }
        },
        error: (err) => {
          console.error('❌ Login error:', err);
        }
      })
    );
  }
  
  
  
  logout(): void {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }
  getUsername(): string | null {
    return localStorage.getItem("username");
  }
  requestPasswordReset(email: string) {
    return this.http.post<{ message: string }>('/api/auth/request-reset', { email });
  }
  
}
