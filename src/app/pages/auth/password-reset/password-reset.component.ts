import { PasswordResetData } from '@/model/auth';
import { AuthService } from '@/services/auth/auth.service';
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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  imports: [ReactiveFormsModule, NgIf, LoaderComponent],
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent {
  token: string | null = null;
  email: string | null = null;
  isPending: boolean = false;
  passwordResetForm: FormGroup;
  isSubmit: boolean = false;
  error: string | null = null;
  isSend: boolean = false;

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
      this.error = 'Invalid email address provided in the URL.';
    } else {
      this.error = 'Email is missing from the URL.';
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit(): void {
    this.isSubmit = true;

    if (this.passwordResetForm.invalid) {
      this.passwordResetForm.markAllAsTouched();
      return;
    }

    const data: PasswordResetData = this.passwordResetForm.getRawValue();

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

            if (response.status) {
              this.isSend = true;
              this.router.navigate(['/login'], {
                queryParams: { 'reset-password': 1 },
              });
            } else {
              this.error = 'Password reset failed. Please try again.';
            }
          },
          error: (response: HttpErrorResponse) => {
            this.isPending = false;
            this.isSubmit = false;
            this.error =
              (response.error as { message: string })?.message ||
              'An unknown error occurred.';
          },
          complete: () => {
            this.isPending = false;
          },
        });
      });
  }
}
