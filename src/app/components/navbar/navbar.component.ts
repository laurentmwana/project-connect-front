import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { Router, RouterLink } from '@angular/router';
import { UserLocalService } from '@/services/user-local.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [ThemeToggleComponent, RouterLink],
})
export class NavbarComponent {
  notificationCount = 2;

  activeTab = 'discover';

  constructor(
    private UserLocalService: UserLocalService,
    private router: Router
  ) {}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onLogout() {
    const isLogout = this.UserLocalService.removeUser();

    if (isLogout) {
      this.router.navigate(['/login'], {
        queryParams: { 'is-logout': 1 },
      });
    }
  }
}
