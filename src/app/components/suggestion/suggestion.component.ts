import { Component, OnInit } from '@angular/core';
import { FollowService, User } from '@/services/follow.service';
import { NgFor, NgIf } from '@angular/common';
import { FollowButtonComponent } from "../follow-button/follow-button.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-suggestion',
  imports: [NgFor, FollowButtonComponent, NgIf, RouterLink],
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionsComponent implements OnInit {
  suggestions: User[] = [];

  constructor(private followService: FollowService) {}

  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    this.followService.getSuggestions().subscribe(users => {
      this.suggestions = users;
    });
  }

  follow(userId: number): void {
    this.followService.follow(userId).subscribe({
      next: () => {
        // Optionnel : retirer l’utilisateur suivi de la liste des suggestions
        this.suggestions = this.suggestions.filter(user => user.id !== userId);
      },
      error: (err) => {
        console.error('Erreur lors du suivi:', err);
      }
    });
  }
}
