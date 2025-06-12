import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FollowService } from '@/services/follow.service';
import { UserLocalService } from '@/services/user-local.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follow-button',
  imports:[ NgIf],
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.css'],
  standalone: true
})
export class FollowButtonComponent implements OnChanges {
  @Input() userId!: number;
  @Input() initialIsFollowing: boolean = false;

  @Output() followChange = new EventEmitter<boolean>();

  isFollowing: boolean = this.initialIsFollowing;
  loading: boolean = false;
  showLoginModal: boolean = false; // contrôle l’affichage du modal

  constructor(
    private followService: FollowService,
    private userLocalService: UserLocalService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialIsFollowing']) {
      this.isFollowing = this.initialIsFollowing;
    }
  }

  toggleFollow(): void {
    if (this.loading) return;

    // Vérifier si l'utilisateur est connecté
    if (!this.userLocalService.isLoggedIn()) {
      this.showLoginModal = true; // afficher le modal
      return;
    }

    this.loading = true;

    if (this.isFollowing) {
      this.followService.unfollow(this.userId).subscribe({
        next: (res) => {
          this.isFollowing = res.is_following;
          this.followChange.emit(this.isFollowing);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.followService.follow(this.userId).subscribe({
        next: (res) => {
          this.isFollowing = res.is_following;
          this.followChange.emit(this.isFollowing);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  closeModal(): void {
    this.showLoginModal = false;
  }
  onLogin(): void {
  this.closeModal();
  this.router.navigate(['/login']);
  }
}
