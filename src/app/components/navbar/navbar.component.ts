import { RechercheService } from '@/services/recherche.service';
import { UserLocalService } from '@/services/user-local.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthenticatedUser } from '@/model/auth';
import { ProjectService } from '@/services/project.service';
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
  notificationCount = 2;
  searchTerm = '';

  activeTab = 'discover';

  constructor(
    private router: Router,
    private userLocalService: UserLocalService,
    private searchService: RechercheService,
    private projectService: ProjectService
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

  // Cette méthode sera appelée à chaque frappe dans l'input
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      // Met à jour le BehaviorSubject dans SearchService
      this.searchService.setSearchTerm(input.value.trim());
    }
  }
  launchSearch(): void {
    this.projectService.getAllProjects(1, this.searchTerm).subscribe((res) => {
      this.searchService.setSearchTerm(this.searchTerm.trim()); // Met à jour le service central
    });
  }
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.launchSearch();
    }
  }
}
