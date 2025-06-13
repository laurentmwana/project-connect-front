import { Experience } from '@/model/experience';
import { Portfolio } from '@/model/portfolio';
import { ExperienceService } from '@/services/experience.service';
import { PortfolioService } from '@/services/portfolio.service';
import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  imports: [NgFor],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent {
 
  constructor(private portofolioService: PortfolioService, private experienceService : ExperienceService) {}

  portfolios!: Portfolio[];
   experiences!: Experience[];
  ngOnInit() {
    this.getMyPortofolios();
    this.getExperiences();
  }

  getMyPortofolios() {
    this.portofolioService.getMyPortofolios().subscribe({
      next: (response) => {
        this.portfolios = response.data;
        console.log('message dans la console', this.portfolios);
      },
      error: (err) => {
        console.log(err.error);
      },
    });
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
