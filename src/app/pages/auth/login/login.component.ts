import { UserLocalService } from '@/services/user-local.service';
import { AuthService } from '@/services/auth.service';
import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '@/shared/loader/loader.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticatedUser, LoginCredentials } from '@/model/auth';
import { FieldErrors, ValidationServerResult } from '@/model/default';
import { ErrorsValidatorPipe } from '@/pipe/errors-validator.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, LoaderComponent, ErrorsValidatorPipe],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  isPending = false;
  isSubmit = false;
  error: string | null = null;
  validatorMessage: ValidationServerResult | null = null;
  isLogout = false;
  isResetPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userLocalService: UserLocalService
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit(): void {
    const queryParams = this.activatedRoute.snapshot.queryParamMap;

    this.isResetPassword = queryParams.has('reset-password');
    this.isLogout = queryParams.has('is-logout');

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        'reset-password': null,
        'new-register': null,
        'is-logout': null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  onSubmit(): void {
    this.isSubmit = true;
    this.isResetPassword = false;
    this.isLogout = false;
    this.error = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: LoginCredentials = this.loginForm.getRawValue();

    this.isPending = true;

    this.authService
      .authenticate(credentials)
      .then((observable) => {
        observable.subscribe({
          next: (response) => {
            this.isPending = false;
            this.isSubmit = false;

            const { status, message, data, errors } = response as {
              status: number;
              message: string;
              data?: AuthenticatedUser;
              errors?: FieldErrors;
            };

            if ([403, 404, 422].includes(status)) {
              if (errors) {
                this.validatorMessage = {
                  message: message,
                  errors: errors,
                };
              } else {
                this.error = message;
              }

              this.resetFieldPassword();
              return;
            }

            if (data) {
              this.userLocalService.createUser(data);
              this.router.navigate(['/']);
            } else {
              this.error = 'Une erreur est survenue, merci de réessayer';
              this.resetFieldPassword();
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.isPending = false;
            this.isSubmit = false;

            this.error =
              errorResponse.error?.message || 'Erreur serveur inconnue';
            this.resetFieldPassword();
          },
          complete: () => {
            this.isPending = false;
          },
        });
      })
      .catch(() => {
        this.isPending = false;
        this.isSubmit = false;
        this.error = 'Erreur de connexion au serveur';
        this.resetFieldPassword();
      });
  }

  private resetFieldPassword(): void {
    this.loginForm.patchValue({ password: '' });
  }
}
