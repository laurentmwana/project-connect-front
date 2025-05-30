import { FieldErrors, ValidationServerResult } from '@/model/default';
import { ErrorsValidatorPipe } from '@/pipe/errors-validator.pipe';
import { AuthService } from '@/services/auth.service';
import { LoaderComponent } from '@/shared/loader/loader.component';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [NgIf, LoaderComponent, ReactiveFormsModule, ErrorsValidatorPipe],
  templateUrl: './forgot.component.html',
})
export class ForgotComponent {
  forgotForm: FormGroup;
  isPending = false;
  isSubmit = false;
  error: string | null = null;
  validatorMessage: ValidationServerResult | null = null;
  isSend = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit(): void {
    this.isSubmit = true;
    this.error = null;

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const { email } = this.forgotForm.value;

    this.isPending = true;

    this.authService
      .forgotPassword(email)
      .then((observable) => {
        observable.subscribe({
          next: (response) => {
            this.isPending = false;
            this.isSubmit = false;
            this.isSend = false;

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
              return;
            }

            if (status === 200) {
              this.isSend = true;
            } else {
              this.error = 'Une erreur est survenue, merci de réessayer';
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.isPending = false;
            this.isSubmit = false;

            this.error =
              errorResponse.error?.message || 'Erreur serveur inconnue';
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
      });
  }
}
