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

  projectparticiped: Project[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjectParticiped();
  }

  loadProjectParticiped(page: number = 1) {
    this.projectService.getProjectParticiped().subscribe({
      next: (res) => {
        this.projectparticiped = res.data;
        this.currentPage = res.meta.current_page;
        this.totalPages = res.meta.last_page;
      },
      error: (error) => {
        console.error('Erreur :', error);
      },
    });

  }
  changePage(page: number) {
    console.log(page)
    this.loadProjectParticiped(page);
  }
}
