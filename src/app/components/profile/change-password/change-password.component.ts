import { ProfileService } from '@/services/profile.service';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
  AbstractControl,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'profile-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  imports: [NgIf, ReactiveFormsModule, FormsModule],
  standalone: true,
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  isPending = false;
  error: string | null = null;
  success: string | null = null;
  isSubmit = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private profileService: ProfileService
  ) {
    this.changePasswordForm = this.formBuilder.group(
      {
        current_password: new FormControl('', [
          Validators.required,
          Validators.maxLength(255),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        password_confirmation: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );
  }

  /**
   * Vérifie que les champs new_password et password_confirmation sont identiques.
   */
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  /**
   * Gère la soumission du formulaire.
   */
  onSubmit() {
    this.isSubmit = true;
    this.error = null;

    if (this.changePasswordForm.invalid) {
      return;
    }

    this.setupControlErrorReset();

    this.isPending = true;

    const { current_password, password, password_confirmation } =
      this.changePasswordForm.value;

    this.profileService
      .changePassword({
        current_password,
        password,
        password_confirmation,
      })
      .subscribe({
        next: (res) => {
          if (res.state) {
            // set messages
            this.success = 'Votre mot de passe a été modifié';

            this.router.navigate(['/profile/edit'], {
              queryParams: { target: 'security' },
            });
          } else {
            this.error =
              "Nous n'avons pas pu modifier le mot de passe, merci de réessayer.";
          }

          this.isPending = false;
        },
        error: (err) => {
          this.isPending = false;

          if (err.status === 422 && err.error.errors) {
            const validationErrors = err.error.errors;

            // Assigner les erreurs aux contrôles du formulaire
            Object.keys(validationErrors).forEach((field) => {
              const control = this.changePasswordForm.get(field);
              if (control) {
                control.setErrors({
                  ...control.errors, // conserver les erreurs existantes
                  serverError: validationErrors[field][0], // on prend la première
                });
              }
            });
          } else {
            // Erreur globale inattendue
            this.error = err.message || 'Une erreur est survenue.';
          }
        },
      });
  }

  private setupControlErrorReset() {
    Object.keys(this.f).forEach((key) => {
      const control = this.changePasswordForm.get(key);
      control?.valueChanges.subscribe(() => {
        if (control.errors?.['serverError']) {
          const { serverError, ...otherErrors } = control.errors;
          control.setErrors(
            Object.keys(otherErrors).length ? otherErrors : null
          );
        }
      });
    });
  }

  private resetForm() {
    this.changePasswordForm.reset({
      current_password: '',
      password: '',
      password_confirmation: '',
    });
  }

  /**
   * Accès rapide aux contrôles du formulaire dans le template
   */
  get f() {
    return this.changePasswordForm.controls;
  }
}
