import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
} from '@angular/core';
import { FollowService } from '@/services/follow.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserProfile } from '@/model/profile';
import { TextInitialPipe } from '@/pipe/textInitial.pipe';

@Component({
  selector: 'app-info-user',
  standalone: true,
  imports: [CommonModule, TextInitialPipe],
  templateUrl: './info-user.component.html',
  styleUrl: './info-user.component.css',
})
export class InfoUserComponent implements OnInit {
  @Input() userId: number = 0;
  @Input() initialIsFollowing: boolean = false;
  @Input() isOwnProfile: boolean = false;
  isPending = true;

  @Input() userProfile: UserProfile | null = null;
  @Input() userProfileLoading: boolean = true;

  @Output() followChange = new EventEmitter<boolean>();
  @Output() messageClick = new EventEmitter<string>();
  @Output() editProfileClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  followersCount: number = 0;
  followingCount: number = 0;
  totalConnections: number = 0;

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
