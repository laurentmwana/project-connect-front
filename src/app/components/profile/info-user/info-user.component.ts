import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
} from '@angular/core';
import { FollowService } from '@/services/follow.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-user.component.html',
  styleUrl: './info-user.component.css',
})
export class InfoUserComponent implements OnInit {
  @Input() userId: number = 0;
  @Input() initialIsFollowing: boolean = false;
  @Input() isOwnProfile: boolean = false;

  @Input() userProfile?: {
    name: string;
    profile_photo?: string;
    job_title?: string;
    location?: string;
    email?: string;
    phone?: string;
    portfolio_url?: string;
    availability?: string;
    about?: string;
  };

  @Output() followChange = new EventEmitter<boolean>();
  @Output() messageClick = new EventEmitter<string>();
  @Output() editProfileClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  followersCount: number = 0;
  followingCount: number = 0;
  totalConnections: number = 0;

  get userInitials(): string {
    if (this.userProfile?.name) {
      return this.userProfile.name
        .split(' ')
        .map((n) => n[0])
        .join('');
    }
    return 'JD';
  }

  private followService = inject(FollowService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadFollowCounts();
  }

  loadFollowCounts(): void {
    if (!this.userId) return;

    this.followService.getFollowCounts(this.userId).subscribe({
      next: (counts) => {
        this.followersCount = counts.followers_count;
        this.followingCount = counts.following_count;
        this.totalConnections = counts.total_connections;

        console.log();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des follow counts:', err);
      },
    });
  }

  onMessageClick() {
    this.messageClick.emit(this.userId.toString());
  }

  onFollowChange(isFollowing: boolean) {
    this.followChange.emit(isFollowing);
    this.loadFollowCounts();
  }

  navigateToConnections(): void {
    this.router.navigate(['/profile', this.userId, 'connections']);
  }

  onEditProfileClick(): void {
    this.editProfileClick.emit();
  }

  onLogoutClick(): void {
    this.logoutClick.emit();
  }
}
