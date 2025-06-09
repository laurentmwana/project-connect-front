import { Project, ProjectData } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-display',
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css',
})
export class DisplayComponent {
  projectId!: string;
 
  pprojects: ProjectData[] = [];
  currentPage = 1;
  lastPage = 1;

 
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(page: number = 1): void {
    this.projectService.getAllProjects(page).subscribe({
      next: (response) => {
        this.pprojects = response.data;
        this.currentPage = response.meta.current_page;
        this.lastPage = response.meta.last_page;
      },
      error: () => {
        console.error('Erreur de chargement des projets');
      },
    });
  }

  goToNextPage(): void {
    if (this.currentPage < this.lastPage) {
      this.fetchProjects(this.currentPage + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.fetchProjects(this.currentPage - 1);
    }
  }
}
