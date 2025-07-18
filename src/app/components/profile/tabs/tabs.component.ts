import { ProfileService, UserProfile } from '@/services/profile.service';
import { Component, inject } from '@angular/core';
import { AboutMeComponent } from './about_me/about-me/about-me.component';
import { ExperienceComponent } from './experience/experience/experience.component';
import { PortfolioComponent } from './portfolio/portfolio/portfolio.component';
import { MesProjectsComponent } from './mes-projects/mes-projects.component';
import { Skill } from '@/model/skill';
// import { projectParticipedComponent } from "./recommandation/recommandation/project-participed.component";

@Component({
  selector: 'app-tabs',
  imports: [
    AboutMeComponent,
    ExperienceComponent,
    PortfolioComponent,
    MesProjectsComponent,
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent {
  constructor() {}

  userprofile!: UserProfile;
  skills: Skill[] = [];

  userProfileService = inject(ProfileService);

  ngOnInit() {
    this.getUserProfile();
    this.getskill();
  }

  getUserProfile() {
    this.userProfileService.getProfile().subscribe({
      next: (res) => {
        this.userprofile = res;
      },
    });
  }

  getskill() {
    this.userProfileService.getmyskill().subscribe({
      next: (res) => {
        this.skills = res;
      },
    });
  }
}
