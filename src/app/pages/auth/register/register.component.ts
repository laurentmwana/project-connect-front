import { RegisterRequest } from '@/model/auth';
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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [NgIf, ReactiveFormsModule, LoaderComponent, ErrorsValidatorPipe],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  isPending = false;
  registerForm: FormGroup;
  isSubmit = false;
  isRegister = false;
  error: string | null = null;
  validatorMessage: ValidationServerResult | null = null;
  isEmailReadonly = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
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
    token: string | null = null;

  ngOnInit(): void {
    const emailFromQuery = this.route.snapshot.queryParamMap.get('email');
    const tokenQuery = this.route.snapshot.queryParamMap.get('token');
    if (emailFromQuery && tokenQuery) {
      this.registerForm.patchValue({ email: emailFromQuery });
   
      this.isEmailReadonly = true;
    }
      this.token = tokenQuery;
  }

  onSubmit(): void {
    this.clearServerErrors();
    this.error = null;
    this.validatorMessage = null;
    this.isSubmit = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const data: RegisterRequest = {...this.registerForm.getRawValue(),token: this.token};

    this.isPending = true;

    this.authService.register(data).then((observer) => {
      observer.subscribe({
        next: (response) => {
          this.isPending = false;

          const { status, message, errors } = response as {
            status: number;
            message: string;
            errors?: FieldErrors;
          };

          if ([403, 404, 422].includes(status)) {
            if (errors) {
              this.validatorMessage = {
                errors: errors,
                message: message,
              };
            } else {
              this.error = message;
            }
          } else if (status === 201) {
            this.isRegister = true;
          } else {
            this.error = 'Une erreur est survenue, merci de réessayer';
          }
          this.resetFieldPassword();

          return;
        },
        error: (response: HttpErrorResponse) => {
          this.isRegister = false;
          this.isPending = false;
          this.isSubmit = false;
          this.error =
            (response.error as { message: string })?.message ||
            'Une erreur inattendue est survenue.';
        },
        complete: () => {
          this.isPending = false;
          this.error = null;
        },
      });
    });
  }

  private clearServerErrors(): void {
    this.validatorMessage = null;
  }

  private resetFieldPassword(): void {
    this.registerForm.patchValue({
      password: '',
      password_confirmation: '',
    });
    this.registerForm.get('password')?.markAsUntouched();
    this.registerForm.get('password_confirmation')?.markAsUntouched();
  }
}
