import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '@/services/project.service';
import { ProjectData } from '@/model/project';
import { lastValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mes-projects',

  imports: [CommonModule, RouterLink],
  templateUrl: './mes-projects.component.html',
  styleUrl: './mes-projects.component.css',
})
export class MesProjectsComponent {
  ProjectService = inject(ProjectService);

  projects: ProjectData[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = ''; // Pour filtre futur si on veux ajouter une barre de recherche

  async ngOnInit() {
    await this.loadProjects();
  }

  async loadProjects(page: number = 1) {
    try {
      const res = await lastValueFrom(
        this.ProjectService.getAllUserProject(page, this.searchTerm)
      );
      this.projects = res.data;
      this.currentPage = res.meta.current_page;
      this.totalPages = res.meta.last_page;
    } catch (error) {
      console.error('Erreur de chargement des projets:', error);
    }
  }

  changePage(page: number) {
    this.loadProjects(page);
  }

  get pages(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  trackById(index: number, project: ProjectData): number {
    return project.id;
  }
}
