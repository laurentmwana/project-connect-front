import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false)
  darkMode$ = this.darkMode.asObservable()

  constructor() {
    this.initializeTheme()
  }

  initializeTheme(): void {
    const storedTheme = localStorage.getItem("color-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      this.enableDarkMode()
    } else {
      this.disableDarkMode()
    }
  }

  toggleDarkMode(): void {
    if (this.darkMode.value) {
      this.disableDarkMode()
    } else {
      this.enableDarkMode()
    }
  }

  enableDarkMode(): void {
    document.documentElement.classList.add("dark")
    localStorage.setItem("color-theme", "dark")
    this.darkMode.next(true)
  }

  disableDarkMode(): void {
    document.documentElement.classList.remove("dark")
    localStorage.setItem("color-theme", "light")
    this.darkMode.next(false)
  }
}
