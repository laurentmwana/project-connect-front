import { Experience } from '@/model/experience';
import { ExperienceService } from './../../../../../services/experience.service';
import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ExperienceFormComponent } from "../experienceform/experienceform.component";



@Component({
  selector: 'app-experience',
  imports: [NgFor, ExperienceFormComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent {
  constructor(private experienceService: ExperienceService){}

 
  experiences!:Experience[];
   showExperienceModal = false;

ngOnInit(){
  this.getExperiences();
}

  getExperiences(){
    this.experienceService.getExperiences().subscribe({
      next : (data)=> {
        this.experiences = data.data;
      }
    })
  }


  toggleModal(open: boolean) {
    this.showExperienceModal = open;
  }

  onExperienceAdded() {
    this.getExperiences(); // Recharger les expériences après ajout
    this.toggleModal(false); // Fermer le modal
  }
}

