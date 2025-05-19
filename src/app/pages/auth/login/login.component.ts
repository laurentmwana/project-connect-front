import { LoginService } from '@/services/auth/login.service';
import { LoginUser } from '@/model/auth';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {

  loginForm: FormGroup

  isPending: boolean = false

  isSubmit: boolean = false

  constructor(private formBuilder: FormBuilder, private loginService : LoginService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }


  onSubmit() {

    this.isSubmit = true

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: LoginUser = this.loginForm.getRawValue()
    
    this.isPending = true;

    this.loginService.authenticate(credentials).then(observer => {
      observer.subscribe({
        next: (response => {
          if (response.token) {
            localStorage.setItem('user', JSON.stringify(response))
            this.router.navigate(['/'])
          }
        }),
        error: (response => {
          console.log(response)
        }),
        complete: () => {
          this.isPending = false;
        }
      })
    })

  }

}
