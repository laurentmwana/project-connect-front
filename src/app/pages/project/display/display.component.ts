import { Meta, Project, ProjectData } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { RechercheService } from '@/services/recherche.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginationComponent } from '@/components/ui/pagination/pagination.component';
import { PaginationDataResponse } from '@/model/paginate';
import { SidebarComponent } from '@/components/suggestion/sidebar/sidebar.component';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent, SidebarComponent],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css',
})
export class DisplayComponent {
  isLoading = true;
  projects: PaginationDataResponse<ProjectData[]> | null = null;
  searchTerm = '';
  page: number = 1;
  private searchSubscription!: Subscription;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private searchService: RechercheService
  ) {}

  ngOnInit(): void {
    const page = this.route.snapshot.queryParamMap.get('page');

    if (isNaN(Number(page))) {
      this.page = 1;
      throw new Error('Page number is not valid');
    }

    this.page = page ? Number(page) : 1;

    this.fetchProjects(this.page);

    this.searchSubscription = this.searchService.searchTerm$.subscribe(
      (term) => {
        this.onSearch(term);
      }
    );
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  /**
   * @param page numéro de la page à récupérer
   * @description Méthode pour récupérer les projets avec pagination et recherche
   * @returns void
   */
  fetchProjects(page: number = 1): void {
    this.isLoading = true;
    this.projectService.getAllProjects(page, this.searchTerm).subscribe({
      next: (response) => {
        this.projects = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur de chargement', error);
        this.isLoading = false;
      },
    });
  }

  /**
   *
   * @param term string
   * @description Méthode pour gérer la recherche de projets
   * @returns void
   */
  onSearch(term: string): void {
    this.searchTerm = term;
    this.fetchProjects(1);
  }

  onPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.fetchProjects(page);

    this.page = page;
  }
}
