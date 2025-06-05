import { ProjectData } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { CandidacyService } from '@/services/candidacy.service';
import { Candidacy, Meta } from '@/model/candidacy';
import { UserLocalService } from '@/services/user-local.service';

@Component({
  selector: 'app-project-detail',
  imports: [NgIf, NgFor, NavbarComponent, NgClass],
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
  isOwner: boolean = false;

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

  message: string = '';

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response) => {
        this.project = response.data;

        const user = this.userLocalService.getUser();
        this.isOwner = user?.id === this.project.created_by.id;
        console.log(this.isOwner);

        if (this.isOwner) {
          this.loadCandidacies(Number(this.projectId));
        }
      },
      error: () => (this.errorMessage = 'Erreur lors du chargement du projet'),
    });
  }

  loadCandidacies(projectId: number) {
    this.candidacyService
      .getCandidacies(+this.projectId, {
        role_name: this.roleFilter,
        user_name: this.userFilter,
        is_validated:
          this.validatedFilter >= 0 ? this.validatedFilter : undefined,
        per_page: 10,
        page: this.currentPage,
      })
      .subscribe({
        next: (response) => {
          this.candidacies = response.data;
          console.log(this.candidacies, 'fonction loadCandidacies');
          this.meta = response.meta;
        },
        error: () => {
          this.showToast('Erreur lors du chargement des candidatures', 'error');
        },
      });
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

  showToast(message: string, type: 'success' | 'error') {
    const toast = { message, type };
    this.toasts.push(toast);

    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t !== toast);
    }, 3000);
  }
}
