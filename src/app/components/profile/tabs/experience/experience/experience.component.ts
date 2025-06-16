import { Experience } from '@/model/experience';
import { ExperienceService } from './../../../../../services/experience.service';
import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-experience',
  imports: [NgFor],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent {
  constructor(private experienceService: ExperienceService){}

  experiences!:Experience[];
ngOnInit(){
  this.getExperiences();
}

  getExperiences(){
    this.experienceService.getExperiences().subscribe({
      next : (data)=> {
        this.experiences = data.data;
        console.log('Messaged dans fjkfkfk', this.experiences);
      }
    })
  }

}
