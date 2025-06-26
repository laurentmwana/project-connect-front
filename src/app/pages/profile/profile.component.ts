import { Component, OnInit } from '@angular/core';
import { ProfileService, UserProfile } from '@/services/profile.service';
import { FormBuilder, FormGroup, NgForm, NgModelGroup, ReactiveFormsModule } from '@angular/forms';
import { InfoUserComponent } from "../../components/profile/info-user/info-user.component";
import { TabsComponent } from "../../components/profile/tabs/tabs.component";
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule, InfoUserComponent, TabsComponent, NgIf],
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

  constructor(private profileService: ProfileService, private fb: FormBuilder, private route: ActivatedRoute) {}

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

    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        if (this.userProfile && 'id' in this.userProfile) {
          this.userId = this.userProfile.id as number;
        }
        this.profileForm.patchValue(profile);
        if (profile.profile_photo) {
          this.profilePhotoPreview = profile.profile_photo;
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil', err);
        this.errorMessage = 'Impossible de charger le profil. Veuillez réessayer.';
      },
    });
  }

  onFollowChange(isFollowing: boolean): void {
    this.initialIsFollowing = isFollowing;
  }

  onMessageClick(): void {
    // Logic for message click
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
      this.loadProfile();
    },
    error: err => {
      this.errorMessage = 'Erreur lors de la mise à jour du profil.';
      this.loading = false;
      console.error(err);
    },
  });
}

}
