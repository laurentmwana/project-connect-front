import { FollowService } from '@/services/follow.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

//import { FollowButtonComponent } from './follow-button.component';

@Component({
  selector: 'app-follow-button',
  template: `
    <button (click)="toggleFollow()" [disabled]="loading">
      {{ isFollowing ? 'Ne plus suivre' : 'Suivre' }}
    </button>
  `,
})
export class FollowButtonComponent implements OnInit {
  @Input() userId!: number;        // utilisateur à suivre / unfollow
  @Input() initialIsFollowing = false;

  @Output() followChange = new EventEmitter<boolean>();

  isFollowing = false;
  loading = false;

  constructor(private followService: FollowService) {}

  ngOnInit() {
    this.isFollowing = this.initialIsFollowing;
  }

  toggleFollow() {
    this.loading = true;
    if (this.isFollowing) {
      this.followService.unfollow(this.userId).subscribe({
        next: () => {
          this.isFollowing = false;
          this.followChange.emit(false);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          // Gestion d'erreur possible ici
        },
      });
    } else {
      this.followService.follow(this.userId).subscribe({
        next: () => {
          this.isFollowing = true;
          this.followChange.emit(true);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          // Gestion d'erreur possible ici
        },
      });
    }
  }
}