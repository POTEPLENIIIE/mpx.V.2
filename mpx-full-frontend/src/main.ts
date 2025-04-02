import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

// Патч для performance.now, якщо відсутній (наприклад, в деяких мобільних браузерах або SSR)
if (
  typeof performance === "undefined" ||
  typeof performance.now !== "function"
) {
  (window as any).performance = {
    now: () => Date.now(),
  };
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
