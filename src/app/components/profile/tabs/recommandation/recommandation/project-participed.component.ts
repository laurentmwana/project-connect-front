import { Component, OnInit } from '@angular/core';
import { Project } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-project-participed',
  templateUrl: './project-participed.component.html',
  imports:[NgFor]
})
export class ProjectParticipedComponent implements OnInit {
totalPages: any;
changePage(arg0: number) {
throw new Error('Method not implemented.');
}
  projectparticiped: Project[] = [];
currentPage: any;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjectParticiped();
  }

  loadProjectParticiped() {
    this.projectService.getProjectParticiped().subscribe({
      next: (projects) => {
        console.log(' projets récupérés :', projects);
        this.projectparticiped = projects;
      },
      error: (error) => {
        console.error('Erreur :', error);
      },
    });
  }
}
