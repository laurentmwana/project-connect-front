import { AuthService } from '@/services/auth/auth.service';
import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [ThemeToggleComponent, RouterLink],
})
export class NavbarComponent {
  notificationCount = 2;

  activeTab = 'discover';

  constructor(private authService: AuthService, private router: Router) {}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onLogout() {
    const isLogout = this.authService.logoutUser();

    if (isLogout) {
      this.router.navigate(['/login'], {
        queryParams: { 'is-logout': 1 },
      });
    }
  }
}
