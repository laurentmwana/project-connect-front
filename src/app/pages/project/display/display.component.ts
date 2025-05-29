import { Project, ProjectData } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-display',
  imports: [NgIf, NgFor,RouterLink],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css',
})
export class DisplayComponent {
  projectId!: string;
  // projectData: Project[] = [];
  projectData: ProjectData[] = [];
  // isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  
  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projectData = projects; // Pas de slice(), on garde tout
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des projets';
      },
    });
  }
  // getSkills(project: ProjectData): string[] {
  //   return [
  //     ...new Set(
  //       project.project_roles_skills.flatMap((role) =>
  //         role.skills.map((skill) => skill.name)
  //       )
  //     ),
  //   ];
  // }
}
