
import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RechercheService } from '@/services/recherche.service';
import { AuthService } from '@/services/auth.service';
import { UserLocalService } from '@/services/user-local.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [ThemeToggleComponent, RouterLink, FormsModule],
})
export class NavbarComponent {
  notificationCount = 2;

  activeTab = 'discover';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userLocalService : UserLocalService ,
    private searchService: RechercheService
  ) {}

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
  

  // Cette méthode sera appelée à chaque frappe dans l'input
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      // Met à jour le BehaviorSubject dans SearchService
      this.searchService.setSearchTerm(input.value.trim());
    }
  }
}
