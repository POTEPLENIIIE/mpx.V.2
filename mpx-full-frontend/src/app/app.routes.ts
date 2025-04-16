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
    path: "forgot-password",
    loadComponent: () =>
      import("./forgot-password/forgot-password.component").then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("./reset-password/reset-password.component").then(
        (m) => m.ResetPasswordComponent
      ),
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
    path: "verify-email",
    loadComponent:()=>
      import("./verify-email/verify-email.component").then((m) => m.VerifyEmailComponent),
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./profile/profile.component").then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },

  { path: "", redirectTo: "home", pathMatch: "full" },
];
