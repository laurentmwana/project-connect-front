import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [ThemeToggleComponent, RouterLink],
})
export class NavbarComponent {
  notificationCount = 2;

  activeTab = 'discover';

  constructor() {}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
