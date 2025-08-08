import { Component, OnInit, inject } from '@angular/core';
import { ProfileService } from '@/services/profile.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InfoUserComponent } from '../../components/profile/info-user/info-user.component';
import { TabsComponent } from '../../components/profile/tabs/tabs.component';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLocalService } from '@/services/user-local.service';
import { ChatService } from '@/services/chat.service';
import { ChatType } from '@/model/message.model';
import { UserProfile } from '@/model/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [InfoUserComponent, TabsComponent],
})
export class ProfileComponent implements OnInit {
  profilePhotoPreview: string | ArrayBuffer | null = null;
  userProfile: UserProfile | null = null;
  userProfileLoading: boolean = true;
  loading = false;
  successMessage = '';
  errorMessage = '';
  userId: number = 0;
  initialIsFollowing: boolean = false;
  isOwnProfile: boolean = false;

  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private userLocalService = inject(UserLocalService);
  private chatService = inject(ChatService);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const profileId = params['id'];
      if (profileId) {
        this.loadUserProfile(profileId);
      } else {
        this.loadOwnProfile();
      }
    });
  }

  loadOwnProfile(): void {
    this.isOwnProfile = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => this.handleProfileResponse(profile),
      error: (err) => this.handleProfileError(err),
    });
  }

  loadUserProfile(id: number): void {
    this.profileService.getProfileById(id).subscribe({
      next: (profile) => {
        const currentUser = this.userLocalService.getUser();
        this.isOwnProfile = currentUser ? currentUser.id === profile.id : false;
        this.handleProfileResponse(profile);
      },
      error: (err) => this.handleProfileError(err),
    });
  }

  handleProfileResponse(profile: UserProfile): void {
    this.userProfile = profile;
    this.userProfileLoading = false;
  }

  handleProfileError(err: any): void {
    console.error('Erreur lors du chargement du profil', err);
    this.errorMessage = 'Impossible de charger le profil. Veuillez réessayer.';
    this.userProfileLoading = false;
  }

  onFollowChange(isFollowing: boolean): void {
    this.initialIsFollowing = isFollowing;
  }

  onMessageClick(): void {
    if (this.userId) {
      const currentUser = this.userLocalService.getUser();
      if (currentUser) {
        this.chatService.getChats().subscribe((chats) => {
          const existingChat = chats.find(
            (chat) =>
              chat.type === ChatType.Private &&
              chat.users.length === 2 &&
              chat.users.some((user) => user.id === currentUser.id) &&
              chat.users.some((user) => user.id === this.userId)
          );

          if (existingChat) {
            this.router.navigate(['/message', existingChat.id]);
          } else {
            const data = {
              type: ChatType.Private,
              user_ids: [currentUser.id, this.userId],
            };
            this.chatService.createChat(data).subscribe({
              next: (chat) => {
                this.router.navigate(['/message', chat.id]);
              },
              error: (err) => {
                console.error('Erreur lors de la création du chat', err);
              },
            });
          }
        });
      }
    }
  }

  onLogout(): void {
    this.userLocalService.removeUser();
    this.router.navigate(['/login']);
  }
}
