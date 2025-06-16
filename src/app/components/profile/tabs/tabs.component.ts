import { Component } from '@angular/core';
import { AboutMeComponent } from './about_me/about-me/about-me.component';
import { ExperienceComponent } from './experience/experience/experience.component';
import { PortfolioComponent } from './portfolio/portfolio/portfolio.component';
import { RecommandationComponent } from './recommandation/recommandation/recommandation.component';

@Component({
  selector: 'app-tabs',
  imports: [
    AboutMeComponent,
    ExperienceComponent,
    PortfolioComponent,
    RecommandationComponent,
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent {
  constructor() {}
}
