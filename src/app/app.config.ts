import { type ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideHttpClient } from "@angular/common/http"

import { routes } from "./app.routes"
import { ThemeService } from "./services/theme.service"

export function initializeTheme(themeService: ThemeService) {
  return () => themeService.initializeTheme()
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTheme,
      deps: [ThemeService],
      multi: true,
    },
  ],
}
