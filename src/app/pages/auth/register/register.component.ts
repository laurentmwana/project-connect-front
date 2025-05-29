import { RegisterData } from '@/model/auth';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [NgIf, ReactiveFormsModule, LoaderComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  isPending: boolean = false;
  registerForm: FormGroup;
  isSubmit: boolean = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
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

  onSubmit(): void {
    this.isSubmit = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const data: RegisterData = this.registerForm.getRawValue();

    this.isPending = true;

    this.authService.register(data).then((observer) => {
      observer.subscribe({
        next: () => {
          this.isPending = false;

          this.router.navigate(['/login'], {
            queryParams: { 'new-register': 1 },
          });
        },
        error: (response: HttpErrorResponse) => {
          this.isPending = false;
          this.isSubmit = false;
          this.error =
            (response.error as { message: string })?.message ||
            'Une erreur inattendue est survenue.';
        },
        complete: () => {
          this.isPending = false;
        },
      });
    });
  }
}
