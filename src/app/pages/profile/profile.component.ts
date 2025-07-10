import { Component, OnInit, inject } from '@angular/core';
import { ProfileService, UserProfile } from '@/services/profile.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InfoUserComponent } from "../../components/profile/info-user/info-user.component";
import { TabsComponent } from "../../components/profile/tabs/tabs.component";
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLocalService } from '@/services/user-local.service';
import { ChatService } from '@/services/chat.service';
import { ChatType } from '@/model/message.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule, InfoUserComponent, TabsComponent],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profilePhotoPreview: string | ArrayBuffer | null = null;
  userProfile?: UserProfile;
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
    this.profileForm = this.fb.group({
      name: [''],
      phone: [''],
      location: [''],
      job_title: [''],
      portfolio_url: [''],
      availability: [''],
      profile_photo: [null],
      about : [''],
    });

    this.route.params.subscribe(params => {
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
    this.userId = profile.id;
    this.profileForm.patchValue(profile);
    if (profile.profile_photo) {
      this.profilePhotoPreview = profile.profile_photo;
    }
  }

  handleProfileError(err: any): void {
    console.error('Erreur lors du chargement du profil', err);
    this.errorMessage = 'Impossible de charger le profil. Veuillez réessayer.';
  }

  onFollowChange(isFollowing: boolean): void {
    this.initialIsFollowing = isFollowing;
  }

  onMessageClick(): void {
    if (this.userId) {
      const currentUser = this.userLocalService.getUser();
      if (currentUser) {
        this.chatService.getChats().subscribe(chats => {
          const existingChat = chats.find(chat =>
            chat.type === ChatType.Private &&
            chat.users.length === 2 &&
            chat.users.some(user => user.id === currentUser.id) &&
            chat.users.some(user => user.id === this.userId)
          );

          if (existingChat) {
            this.router.navigate(['/message', existingChat.id]);
          } else {
            const data = {
              type: ChatType.Private,
              user_ids: [currentUser.id, this.userId]
            };
            this.chatService.createChat(data).subscribe({
              next: (chat) => {
                this.router.navigate(['/message', chat.id]);
              },
              error: (err) => {
                console.error('Erreur lors de la création du chat', err);
              }
            });
          }
        });
      }
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profileForm.patchValue({ profile_photo: file });

      const reader = new FileReader();
      reader.onload = e => (this.profilePhotoPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

 onSubmit(): void {
  if (this.profileForm.invalid) return;

  this.loading = true;
  this.successMessage = '';
  this.errorMessage = '';

  const formData = new FormData();

  // Ajout des champs texte
  Object.entries(this.profileForm.value).forEach(([key, value]) => {
  if (key !== 'profile_photo' && value !== undefined && value !== null && value !== '') {
    formData.append(key, String(value));
  }
  });


  // Ajout du fichier profile_photo
  const profilePhoto = this.profileForm.get('profile_photo')?.value;
  if (profilePhoto && profilePhoto instanceof File) {
    formData.append('profile_photo', profilePhoto);
  }

  this.profileService.updateProfile(formData).subscribe({
    next: () => {
      this.successMessage = 'Profil mis à jour avec succès.';
      this.loading = false;
      this.loadOwnProfile();
    },
    error: err => {
      this.errorMessage = 'Erreur lors de la mise à jour du profil.';
      this.loading = false;
      console.error(err);
    },
  });
}

}
