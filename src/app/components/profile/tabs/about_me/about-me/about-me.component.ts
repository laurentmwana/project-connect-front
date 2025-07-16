import { Component, Input, SimpleChanges, TemplateRef } from '@angular/core';
import { UserProfile } from '@/services/profile.service';
import { NgFor, NgIf, NgIfContext } from '@angular/common';
import { Skill } from '@/model/skill';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css'],
  imports: [NgIf, NgFor],
  standalone: true,
})
export class AboutMeComponent {
  @Input() userProfile?: UserProfile;
  @Input() skills: Skill[] = [];
  noSkills: TemplateRef<NgIfContext<number | undefined>> | null | undefined;

  getSkillLevel(percent: number): string {
    if (percent >= 90) return 'Expert';
    if (percent >= 75) return 'Avancé';
    if (percent >= 50) return 'Intermédiaire';
    return 'Débutant';
  }
}
