import { Project, ProjectData } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { RechercheService } from '@/services/recherche.service';

import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-display',
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css',
})
export class DisplayComponent {
  projectId!: string;

  pprojects: ProjectData[] = [];

  searchTerm = '';
  private searchSubscription!: Subscription;
  currentPage = 1;
  lastPage = 1;

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private searchService: RechercheService
  ) {}

  // ngOnInit(): void {
  //   this.fetchProjects();
  // }
  ngOnInit(): void {
    // 1) Charger la page 1 au lancement
    this.fetchProjects(1);

    // 2) S'abonner au service de recherche
    this.searchSubscription = this.searchService.searchTerm$.subscribe(
      (term) => {
        this.searchTerm = term;
        // À chaque modification du terme, on recharge la page 1 avec ce terme
        this.fetchProjects(1);
      }
    );
  }

<<<<<<< HEAD
  fetchProjects(page: number = 1): void {
    this.projectService.getAllProjects(page, this.searchTerm).subscribe({
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
<<<<<<< HEAD

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
