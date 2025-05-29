import { AuthService } from '@/services/auth/auth.service';
import { LoginUser } from '@/model/auth';
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

@Component({
  selector: 'app-login',
  imports: [NgIf, ReactiveFormsModule, LoaderComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  isPending: boolean = false;

  isSubmit: boolean = false;

  error: string | null = null;

  isResetPassword = false;
  isRegister = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    const queryParams = this.activatedRoute.snapshot.queryParamMap;

    this.isResetPassword = queryParams.has('reset-password');
    this.isRegister = queryParams.has('new-register');

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        'reset-password': null,
        'new-register': null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  onSubmit() {
    this.isSubmit = true;
    this.isRegister = false;
    this.isResetPassword = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: LoginUser = this.loginForm.getRawValue();

    this.isPending = true;

    this.authService.authenticate(credentials).then((observer) => {
      observer.subscribe({
        next: (response) => {
          if (response.token) {
            localStorage.setItem('user', JSON.stringify(response));
            this.router.navigate(['/']);
          }
        },
        error: (response: HttpErrorResponse) => {
          this.isPending = false;
          this.isSubmit = false;

          this.error = (response.error as { message: string }).message;

          this.loginForm.patchValue({ password: '' });
        },
        complete: () => {
          this.isPending = false;
        },
      });
    });
  }
}
