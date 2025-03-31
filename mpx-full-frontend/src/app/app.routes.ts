import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "home",
    loadComponent: () =>
      import("./home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./dashboard/dashboard.component").then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: "register",
    loadComponent: () =>
      import("./register/register.component").then((m) => m.RegisterComponent),
  },
  {
    path: "settings",
    loadComponent: () =>
      import("./settings/settings.component").then((m) => m.SettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: "payments",
    loadComponent: () =>
      import("./payments/payments.component").then((m) => m.PaymentsComponent),
    canActivate: [authGuard],
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./profile/profile.component").then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },

  { path: "", redirectTo: "home", pathMatch: "full" },
];
