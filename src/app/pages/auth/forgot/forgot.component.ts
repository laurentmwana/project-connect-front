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

@Component({
  selector: 'app-forgot',
  imports: [NgIf, LoaderComponent, ReactiveFormsModule],
  templateUrl: './forgot.component.html',
})
export class ForgotComponent {
  isPending: boolean = false;
  forgotForm: FormGroup;
  isSubmit: boolean = false;
  error: string | null = null;
  isSend: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit() {
    this.isSubmit = true;

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const { email }: { email: string } = this.forgotForm.value;

    this.isPending = true;

    this.authService.forgotPassword(email).then((observer) => {
      observer.subscribe({
        next: (response) => {
          if (response.status) {
            this.isSend = true;
          } else {
            this.error = response.status;
          }

          this.isPending = false;
          this.error = null;
        },
        error: (response: HttpErrorResponse) => {
          this.isPending = false;
          this.isSubmit = false;

          this.error = (response.error as { message: string }).message;
        },
        complete: () => {
          this.isPending = false;
        },
      });
    });
  }
}
