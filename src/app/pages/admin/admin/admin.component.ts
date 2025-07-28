import { ThemeService } from '@/services/theme.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserManagementComponent } from "../user-management/user-management.component";
import {ProjectManagementComponent} from '@/pages/admin/project-management/project-management.component';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, UserManagementComponent, ProjectManagementComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  activeTab: string = 'dashboard';
  isDarkMode = false;

  tabs = [
    { id: 'dashboard', name: 'Tableau de bord', icon: 'grid' },
    { id: 'users', name: 'Utilisateurs', icon: 'users' },
    { id: 'projects', name: 'Projets', icon: 'folder' },
    { id: 'reports', name: 'Signalements', icon: 'flag' },
    { id: 'analytics', name: 'Analytiques', icon: 'bar-chart-2' },
    { id: 'settings', name: 'Paramètres', icon: 'settings' },
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  get activeTabName(): string {
    return this.tabs.find(t => t.id === this.activeTab)?.name || 'Tableau de bord';
  }

  selectTab(tabId: string) {
    this.activeTab = tabId;
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
