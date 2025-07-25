import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PaginatedProjectsParticiped } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '@/components/ui/pagination/pagination.component';

@Component({
  selector: 'app-project-participed',
  templateUrl: './project-participed.component.html',
  imports: [NgFor, NgIf, PaginationComponent, FormsModule],
})
export class ProjectParticipedComponent implements OnInit {
  isPending = true;
  projectparticiped: PaginatedProjectsParticiped | null = null;
  filteredProjects: any[] = [];
  searchTerm: string = '';

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const queryParams = this.activatedRoute.snapshot.queryParamMap;

    const page = parseInt(queryParams.get('page') || '1');

    if (isNaN(page)) {
      throw new Error('Une erreur est survenue');
    }

    this.loadProjectParticiped(page);
  }

  loadProjectParticiped(page: number = 1) {
    this.projectService.getProjectParticiped(page).subscribe({
      next: (res) => {
        this.isPending = false;
        this.projectparticiped = res;
        this.filteredProjects = res.data;
      },
      error: (error) => {
        this.isPending = false;

        console.error('Erreur :', error);
      },
    });
  }

  onPage(page: number) {
    this.loadProjectParticiped(page);
    this.loadProjectParticiped(page);

    // on fait une redirection en modifiant l'url pour ajouter la page courante ?page
    this.router.navigate(['/profile'], {
      queryParams: { page },
    });
  }
  // ✅ Méthode de recherche simple par titre
  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (this.projectparticiped) {
      this.filteredProjects = this.projectparticiped.data.filter((project) =>
        project.title.toLowerCase().includes(term)
      );
    }
  }
}
