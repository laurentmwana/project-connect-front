import { Meta, Project, ProjectData, User } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { RechercheService } from '@/services/recherche.service';

import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SuggestionsComponent } from "../../../components/suggestion/suggestion.component";

@Component({
  selector: 'app-display',
  imports: [NgIf, NgFor, RouterLink, SuggestionsComponent, CommonModule],
  //imports: [NgIf, NgFor, RouterLink,CommonModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css',
})
export class DisplayComponent {
  projectId!: string;
  isLoading = false;
  totalItems = 0;
  meta!: Meta;
  pages: number[] = [];
  maxVisiblePages = 5;
  pprojects: ProjectData[] = [];

  searchTerm = '';
  private searchSubscription!: Subscription;
  currentPage = 1;
  lastPage = 1;
  Math: Math = Math;

  errorMessage = '';
  suggestions: User[] = [];

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

  fetchProjects(page: number = 1): void {
    this.isLoading = true;
    this.projectService.getAllProjects(page, this.searchTerm).subscribe({
      next: (response) => {
        this.pprojects = response.data;
        this.meta = response.meta;
        this.currentPage = response.meta.current_page;
        this.lastPage = response.meta.last_page;
        this.totalItems = response.meta.total;
        this.updatePages();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur de chargement des projets', error);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des projets';
      },
    });
  }

  updatePages(): void {
    this.pages = [];
    const startPage = Math.max(
      1,
      this.currentPage - Math.floor(this.maxVisiblePages / 2)
    );
    const endPage = Math.min(
      this.lastPage,
      startPage + this.maxVisiblePages - 1
    );

    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.lastPage && page !== this.currentPage) {
      this.fetchProjects(page);
    }
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const maxVisiblePages = 5; // Vous pouvez ajuster ce nombre

    // Toujours afficher la première page
    visiblePages.push(1);

    // Calcul des pages autour de la page courante
    let start = Math.max(2, this.currentPage - 2);
    let end = Math.min(this.lastPage - 1, this.currentPage + 2);

    // Ajuster si nous sommes près du début ou de la fin
    if (this.currentPage <= 3) {
      end = Math.min(1 + maxVisiblePages - 1, this.lastPage - 1);
    } else if (this.currentPage >= this.lastPage - 2) {
      start = Math.max(2, this.lastPage - maxVisiblePages + 1);
    }

    // Ajouter les pages calculées
    for (let i = start; i <= end; i++) {
      if (!visiblePages.includes(i)) {
        visiblePages.push(i);
      }
    }

    // Toujours afficher la dernière page
    if (this.lastPage > 1 && !visiblePages.includes(this.lastPage)) {
      visiblePages.push(this.lastPage);
    }

    return visiblePages.sort((a, b) => a - b);
  }

  shouldShowEllipsis(): boolean {
    const visiblePages = this.getVisiblePages();
    return (
      visiblePages[visiblePages.length - 1] < this.lastPage - 1 ||
      visiblePages[1] > 2
    );
  }
}
