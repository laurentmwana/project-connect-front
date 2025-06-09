import { ProjectData } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { CandidacyService } from '@/services/candidacy.service';
import { Candidacy, Meta, PaginatedCandidacyResponse } from '@/model/candidacy';
import { UserLocalService } from '@/services/user-local.service';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-project-detail',
  imports: [NgIf, NgFor, NavbarComponent, NgClass, FormsModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
})
export class ProjectDetailComponent {
  projectId!: string;
  project!: ProjectData;
  errorMessage = '';
  meta: Meta | null = null;
  candidacies: Candidacy[] = [];
  currentPage: number = 1;
  perPage: number = 10; // Valeur par défaut
  isOwner: boolean = false;
  isLoading: boolean = false;

  // Filtres
  roleFilter: string = '';
  userFilter: string = '';
  validatedFilter: number = -1;

  toasts: { message: string; type: 'success' | 'error' }[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private candidacyService: CandidacyService,
    private userLocalService: UserLocalService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.loadProject();
  }

  loadProject(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response) => {
        this.project = response.data;
        const user = this.userLocalService.getUser();
        this.isOwner = user?.id === this.project.created_by.id;

        if (this.isOwner) {
          this.loadCandidacies();
        }
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement du projet';
        this.showToast(this.errorMessage, 'error');
      },
    });
  }

  loadCandidacies(page: number = this.currentPage): void {
    if (!this.isOwner) return;

    this.isLoading = true;
    this.currentPage = page;

    // Correction : on utilise les bons noms en camelCase
    const params = {
      page: this.currentPage,
      perPage: this.perPage,
      ...(this.roleFilter && { roleName: this.roleFilter }),
      ...(this.userFilter && { userName: this.userFilter }),
      ...(this.validatedFilter >= 0 && {
        isValidated: this.validatedFilter === 1,
      }),
    };

    console.log('Paramètres envoyés au backend:', params);

    this.candidacyService
      .getCandidacies(Number(this.projectId), params)
      .subscribe({
        next: (response: PaginatedCandidacyResponse) => {
          console.log('Réponse complète du backend:', response);
          console.log('Données des candidatures:', response.data);
          console.log('Métadonnées de pagination:', response.meta);

          this.candidacies = response.data;
          this.meta = response.meta;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur reçue du backend:', error);
          console.error("Détails de l'erreur:", error.error);

          this.isLoading = false;
          this.showToast('Erreur lors du chargement des candidatures', 'error');
        },
      });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadCandidacies();
  }

  resetFilters(): void {
    this.roleFilter = '';
    this.userFilter = '';
    this.validatedFilter = -1;
    this.perPage = 10;
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.loadCandidacies(page);
  }

  onPerPageChange(): void {
    this.currentPage = 1;
    this.loadCandidacies();
  }

  onApplyRole(id: number) {
    this.candidacyService.applyForRole(id).subscribe({
      next: () => {
        this.showToast('Candidature soumise avec succès.', 'success');
      },
      error: (err) => {
        let error = err.error;
        this.showToast(`${error.message}`, 'error');
      },
    });
  }

  showToast(message: string, type: 'success' | 'error'): void {
    const toast = { message, type };
    this.toasts.push(toast);
    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t !== toast);
    }, 3000);
  }

  getPageNumbers(): number[] {
    if (!this.meta) return [];

    const pages = [];
    const startPage = Math.max(1, this.meta.current_page - 2);
    const endPage = Math.min(this.meta.last_page, this.meta.current_page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}
