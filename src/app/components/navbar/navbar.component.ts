import { UserLocalService } from '@/services/user-local.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthenticatedUser } from '@/model/auth';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    ThemeToggleComponent,
    RouterLink,
    FormsModule,
    NotificationComponent,
    NgIf,
  ],
})
export class NavbarComponent {
  user: AuthenticatedUser | null = null;
  activeTab = 'discover';

  constructor(
    private router: Router,
    private userLocalService: UserLocalService
  ) {}

  ngOnInit() {
    this.user = this.userLocalService.getUser();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onLogout() {
    const isLogout = this.userLocalService.removeUser();

    if (isLogout) {
      this.router.navigate(['/login'], {
        queryParams: { 'is-logout': 1 },
      });
    }
  }
}
