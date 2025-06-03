import { ProjectData } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../../../components/navbar/navbar.component";

@Component({
  selector: 'app-project-detail',
  imports: [NgIf, NgFor, NavbarComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
})
export class ProjectDetailComponent {
  projectId!: string;
  project!: ProjectData;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

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
}
