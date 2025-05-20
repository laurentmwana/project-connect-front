import { ThemeService } from '@/services/theme.service';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  imports: [NgIf],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  isDark = false

  constructor(private themeService: ThemeService) {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDark = isDark
    })
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode()
  }
}
