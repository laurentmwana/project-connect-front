import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.css'],
  standalone: true
})
export class FollowButtonComponent {
  @Input() userId!: number; // ID de l'utilisateur à suivre
  @Input() initialIsFollowing: boolean = false;

  @Output() followChange = new EventEmitter<boolean>();

  isFollowing: boolean = this.initialIsFollowing;
  loading: boolean = false;

  ngOnChanges(): void {
    this.isFollowing = this.initialIsFollowing;
  }

  toggleFollow(): void {
    this.loading = true;

    // Simuler un appel API : à remplacer par un vrai service HTTP
    setTimeout(() => {
      this.isFollowing = !this.isFollowing;
      this.followChange.emit(this.isFollowing);
      this.loading = false;
    }, 500); // délai simulé
  }
}
