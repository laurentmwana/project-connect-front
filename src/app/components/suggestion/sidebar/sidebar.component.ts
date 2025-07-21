import { FollowUser } from '@/model/follow';
import { FollowService } from '@/services/follow.service';
import { UserLocalService } from '@/services/user-local.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'suggestion-sidebar',
  imports: [RouterLink, NgIf, NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  suggestions: FollowUser[] = [];
  isLoading = true;
  isLoadingMore = false;
  isFollowingLoading = false;

  constructor(
    private followService: FollowService,
    private userLocal: UserLocalService
  ) {}

  ngOnInit(): void {
    const user = this.userLocal.getUser();
    if (!user) {
      this.isLoading = false;
      return;
    }

    this.loadSuggestions();
  }

  /**
   * @description Méthode pour charger les suggestions d'utilisateurs à suivre
   * @returns void
   */
  loadSuggestions(): void {
    this.isLoading = true;
    this.followService.getSuggestions().subscribe((users) => {
      this.isLoading = false;
      this.suggestions = users;
    });
  }

  /**
   * @param userId numéro de l'utilisateur à suivre
   * @description Méthode pour suivre un utilisateur
   * @returns void
   */
  followUser(userId: number): void {
    this.isLoading = true;

    this.followService.follow(userId).subscribe({
      next: (response) => {
        if (response.is_following) {
          this.loadSuggestions();
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur lors du suivi:', err);
      },
    });
  }

  loadMoreSuggestions() {}
}
