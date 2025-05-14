import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  imports: [NgIf],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  isDark = false;

  ngOnInit() {
    const storedTheme = localStorage.getItem('color-theme');
    if (
      storedTheme === 'dark' ||
      (!storedTheme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  toggleDarkMode() {
    if (this.isDark) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode() {
    document.documentElement.classList.add('dark');
    localStorage.setItem('color-theme', 'dark');
    this.isDark = true;
  }

  private disableDarkMode() {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('color-theme', 'light');
    this.isDark = false;
  }
}
