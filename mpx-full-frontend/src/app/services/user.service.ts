import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "http://localhost:4000/api/auth/me"; // Потрібно вказати правильний URL

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem("token"); // Отримуємо токен з локального сховища
    if (!token) {
      throw new Error("Токен відсутній");
    }
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`); // Додаємо токен в заголовок

    return this.http.get<any>(this.apiUrl, { headers }); // Отримуємо дані профілю користувача
  }
}
