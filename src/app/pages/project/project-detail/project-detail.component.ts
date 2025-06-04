import { ProjectData } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { CandidacyService } from '@/services/candidacy.service';

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

  toasts: { message: string; type: 'success' | 'error' }[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private candidacyService: CandidacyService
  ) {}

  message: string = '';

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response) => {
        this.project = response.data;
        console.log(this.project); // Pour vérifier que les données sont là
      },
      error: () => (this.errorMessage = 'Erreur lors du chargement du projet'),
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
