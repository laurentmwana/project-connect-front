import { Component } from '@angular/core';
import { ProjectData } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { PaginationDataResponse } from '@/model/paginate';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RechercheService } from '@/services/recherche.service';
import { CommonModule, NgForOf } from '@angular/common';
import { PaginationComponent } from '@/components/ui/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import {AdminService} from '@/services/admin.service';

@Component({
  selector: 'app-project-management',
  imports: [
    NgForOf,
    CommonModule,
    RouterLink,
    PaginationComponent,
    FormsModule,
  ],
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.css'
})
export class ProjectManagementComponent {
  isLoading = true;
  statsLoading = true;
  projects: PaginationDataResponse<ProjectData[]> | null = null;
  searchTerm = '';
  successMessage =""
  errorMessage =""
  page: number = 1;
  showDeleteModal = false;
  projectToDelete: number | null = null;
  private searchSubscription!: Subscription;

  projectStats = {
    total: 0,
    inProgress: 0,
    completed: 0,
    other: 0
  };

  constructor(
    private projectService: ProjectService,
    private adminService:AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private searchService: RechercheService
  ) {}

  ngOnInit() {
    let page = this.route.snapshot.queryParamMap.get('page');

    if (isNaN(Number(page))) {
      this.page = 1;
    }

    this.page = page ? Number(page) : 1;

    this.fetchProjects(this.page);
    this.loadGlobalStats();

    this.searchSubscription = this.searchService.searchTerm$.subscribe(
      (term) => {
        this.onSearch(term);
      }
    );
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch('');
  }

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

  loadGlobalStats(): void {
    this.statsLoading = true;
    this.projectService.getAllProjects(1, this.searchTerm).subscribe({
      next: (firstPage) => {
        const totalPages = firstPage.meta.last_page;
        const requests: Observable<PaginationDataResponse<ProjectData[]>>[] = [];

        // On commence à 2 car on a déjà la première page
        for (let i = 2; i <= totalPages; i++) {
          requests.push(this.projectService.getAllProjects(i, this.searchTerm));
        }

        if (requests.length > 0) {
          forkJoin(requests).subscribe({
            next: (responses) => {
              const allProjects = [
                ...firstPage.data,
                ...responses.flatMap(response => response.data)
              ];
              this.updateGlobalStats(allProjects);
              this.statsLoading = false;
            },
            error: (err) => {
              console.error('Erreur lors du chargement des stats', err);
              this.updateGlobalStats(firstPage.data);
              this.statsLoading = false;
            }
          });
        } else {
          this.updateGlobalStats(firstPage.data);
          this.statsLoading = false;
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des stats', err);
        this.statsLoading = false;
      }
    });
  }

  updateGlobalStats(projects: ProjectData[]): void {
    this.projectStats = {
      total: projects.length,
      inProgress: projects.filter(p => p.status?.name === 'En cours').length,
      completed: projects.filter(p => p.status?.name === 'Terminé').length,
      other: projects.filter(p =>
        p.status?.name !== 'En cours' && p.status?.name !== 'Terminé'
      ).length
    };
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.fetchProjects(1);
    this.loadGlobalStats();
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

  viewProject(project: ProjectData): void {
    this.router.navigate(['/project', project.slug]);
  }

  deleteProject(id: number): void {
    this.projectToDelete = id;
    this.showDeleteModal = true;
  }
  confirmDelete(): void {
    if (!this.projectToDelete) return;

    this.adminService.destroyProject(this.projectToDelete).subscribe({
      next: (response) => {
        this.successMessage = "Projet supprimé avec succès";
        this.errorMessage = "";
        this.showDeleteModal = false;

        // Rafraîchir les données
        this.fetchProjects(this.page);
        this.loadGlobalStats();

        setTimeout(() => this.successMessage = "", 3000);
      },
      error: (error) => {
        this.errorMessage = error;
        this.showDeleteModal = false;
      }
    });
  }

}
