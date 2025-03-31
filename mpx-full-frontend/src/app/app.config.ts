// Імпортуємо необхідні функції та модулі для налаштування додатку
import {
  ApplicationConfig,
  provideZoneChangeDetection, // Функція для надання зони зміни (для оптимізації Angular)
  importProvidersFrom, // Дозволяє імпортувати провайдери з інших модулів
} from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router'; // Імпортуємо модулі для маршрутизації
import { ReactiveFormsModule } from '@angular/forms'; // Імпортуємо модуль для реактивних форм
import { provideHttpClient } from '@angular/common/http'; // Імпортуємо функцію для надання HTTP-клієнта

import { routes } from './app.routes'; // Імпортуємо маршрути з файлу app.routes.ts

// Конфігурація додатку
export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ReactiveFormsModule), // Імпортуємо провайдери для реактивних форм
    importProvidersFrom(RouterModule), // Імпортуємо провайдери для маршрутизації
    provideHttpClient(), // Надаємо HTTP-клієнт для запитів до сервера
    provideZoneChangeDetection({ eventCoalescing: true }), // Налаштовуємо зону зміни для оптимізації змін
    provideRouter(routes), // Надаємо маршрутизатор з визначеними маршрутами
  ],
};
