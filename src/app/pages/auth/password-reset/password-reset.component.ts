import { ResetPasswordRequest } from '@/model/auth';
import { FieldErrors, ValidationServerResult } from '@/model/default';
import { ErrorsValidatorPipe } from '@/pipe/errors-validator.pipe';
import { AuthService } from '@/services/auth.service';
import { LoaderComponent } from '@/shared/loader/loader.component';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, LoaderComponent, ErrorsValidatorPipe],
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent implements OnInit {
  token: string | null = null;
  email: string | null = null;
  isPending = false;
  passwordResetForm: FormGroup;
  isSubmit = false;
  error: string | null = null;
  validatorMessage: ValidationServerResult | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.passwordResetForm = this.formBuilder.group({
      email: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password_confirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token');

    if (!this.token) {
      throw new Error('Token is missing or invalid.');
    }

    const email = this.activatedRoute.snapshot.queryParamMap.get('email');
    if (email && this.isValidEmail(email)) {
      this.email = email;
      this.passwordResetForm.patchValue({ email: this.email });
    } else if (email) {
      this.error = 'Adresse e-mail invalide fournie dans l’URL.';
    } else {
      this.error = 'L’adresse e-mail est manquante dans l’URL.';
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit(): void {
    this.isSubmit = true;
    this.error = null;

    if (this.passwordResetForm.invalid) {
      this.passwordResetForm.markAllAsTouched();
      return;
    }

    const data: ResetPasswordRequest = this.passwordResetForm.getRawValue();

    this.isPending = true;

    this.authService
      .passwordReset({
        ...data,
        token: this.token as string,
      })
      .then((observer) => {
        observer.subscribe({
          next: (response) => {
            this.isPending = false;

            const { status, message, errors } = response as {
              status: number;
              message: string;
              errors?: FieldErrors;
            };

            if ([404, 422].includes(status)) {
              if (errors) {
                this.validatorMessage = {
                  errors: errors,
                  message: message,
                };
              } else {
                this.error = message;
              }
              this.resetFieldPassword();
              return;
            } else if (status === 200) {
              this.router.navigate(['/login'], {
                queryParams: { 'reset-password': 1 },
              });
            } else {
              this.error = 'Une erreur est survenue, merci de réessayer';
              this.resetFieldPassword();
            }
          },
          error: (response: HttpErrorResponse) => {
            this.isPending = false;
            this.isSubmit = false;
            this.error =
              (response.error as { message: string })?.message ||
              'Une erreur inconnue est survenue.';
          },
          complete: () => {
            this.isPending = false;
          },
        });
      })
      .catch(() => {
        this.isPending = false;
        this.isSubmit = false;
        this.error = 'Erreur de connexion au serveur.';
      });
  }

  private resetFieldPassword(): void {
    this.passwordResetForm.patchValue({
      password: '',
      password_confirmation: '',
    });
  }
}
