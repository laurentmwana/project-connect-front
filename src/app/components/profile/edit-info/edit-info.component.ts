import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { ProfileService } from '@/services/profile.service';
import { UserProfile } from '@/model/profile';
import { Subscription } from 'rxjs';

@Component({
  selector: 'profile-edit-info',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.css'],
})
export class EditInfoComponent implements OnInit, OnDestroy {
  editInfoForm!: FormGroup;
  isPending = false;
  error: string | null = null;
  success: string | null = null;
  isSubmit = false;
  isPendingProfile = true;
  profile: UserProfile | null = null;

  private routeSub?: Subscription;
  private profileSub?: Subscription;
  private _subs: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.fetchProfile();

    this.routeSub = this.activatedRoute.queryParamMap.subscribe((params) => {
      const target = params.get('target');
      if (target === 'info') {
        this.fetchProfile();
      }
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.profileSub?.unsubscribe();
    this._subs.forEach((s) => s.unsubscribe());
  }

  private buildForm() {
    this.editInfoForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255),
      ]),
      job_title: new FormControl('', [Validators.maxLength(255)]),
      phone: new FormControl('', [
        Validators.minLength(10),
        Validators.maxLength(13),
      ]),
      about: new FormControl('', [Validators.maxLength(1000)]),
      location: new FormControl('', [Validators.maxLength(255)]),
      portfolio_url: new FormControl('', [Validators.maxLength(255)]),
      // pour l'édition on ne force pas le upload de photo -> pas de Validators.required
      is_availability: new FormControl(false),
      profile_photo: new FormControl(null),
    });

    this.setupControlErrorReset();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.editInfoForm.patchValue({ profile_photo: file });
      this.editInfoForm.get('profile_photo')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    this.isSubmit = true;
    this.error = null;
    this.success = null;

    // forcer l'affichage des erreurs si invalide
    if (this.editInfoForm.invalid) {
      this.editInfoForm.markAllAsTouched();
      return;
    }

    this.isPending = true;
    const formData = new FormData();


    Object.entries(this.editInfoForm.value).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      // gérer File correctement
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else {
        formData.append(key, String(value));
      }
    });

    this.profileSub = this.profileService.updateProfile(formData).subscribe({
      next: () => {
        this.isPending = false;
        this.success = 'Profil mis à jour avec succès !';
      },
      error: (err) => {
        this.isPending = false;
        if (err.status === 422 && err.error?.errors) {
          const validationErrors = err.error.errors;
          Object.keys(validationErrors).forEach((field) => {
            const control = this.editInfoForm.get(field);
            if (control) {
              control.setErrors({
                ...control.errors,
                serverError: validationErrors[field][0],
              });
            }
          });
        } else {
          this.error = err.message || 'Une erreur est survenue.';
        }
      },
    });
  }

  private setupControlErrorReset() {
    Object.keys(this.editInfoForm.controls).forEach((key) => {
      const control = this.editInfoForm.get(key);
      if (!control) return;
      const s = control.valueChanges.subscribe(() => {
        if (control.errors?.['serverError']) {
          const { serverError, ...otherErrors } = control.errors;
          control.setErrors(
            Object.keys(otherErrors).length ? otherErrors : null
          );
        }
      });
      this._subs.push(s);
    });
  }

  private fetchProfile() {
    this.isPendingProfile = true;
    this.profileSub = this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isPendingProfile = false;

        // patcher les valeurs récupérées dans le formulaire
        if (this.editInfoForm) {
          this.editInfoForm.patchValue({
            name: profile.name ?? '',
            email: profile.email ?? '',
            job_title: profile.job_title ?? '',
            phone: profile.phone ?? '',
            about: profile.about ?? '',
            location: profile.location ?? '',
            portfolio_url: profile.portfolio_url ?? '',
            is_availability: profile.is_availability ?? false,
          });
        }

        // si tu veux rendre le champ photo non-requis quand une URL existe :
        // if (profile.profile_photo_url) {
        //   this.editInfoForm.get('profile_photo')?.clearValidators();
        //   this.editInfoForm.get('profile_photo')?.updateValueAndValidity();
        // }
      },
      error: () => {
        this.isPendingProfile = false;
      },
    });
  }

  get f() {
    return this.editInfoForm.controls;
  }
}
