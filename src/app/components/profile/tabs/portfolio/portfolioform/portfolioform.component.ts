import {Component, inject} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PortfolioService} from '@/services/portfolio.service';

@Component({
  selector: 'app-portfolioform',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './portfolioform.component.html',
  styleUrl: './portfolioform.component.css'
})
export class PortfolioformComponent {

  portfolioService = inject(PortfolioService)
  router = inject(Router)

  successMessage = ""
  formError = '';
  formSubmitted = false
  submitting = false

  portfoliofrom = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    link: new FormControl('', [Validators.required]),
    skill: new FormControl([],[Validators.required]),
  })

  onSubmit() {

    this.submitting = true;

    if (this.portfoliofrom.invalid) {
      this.submitting = false;
      this.formError = 'Veuillez corriger les erreurs dans le formulaire.';
      setTimeout(() => {
        this.formError = '';
      }, 5000);
      this.portfoliofrom.markAllAsTouched()
      return
    }

    this.portfolioService.createPortfolio(
      {
        name: this.portfoliofrom.value.name ?? '',
        description: this.portfoliofrom.value.description ?? '',
        link: this.portfoliofrom.value.link ?? '',
        skill: this.portfoliofrom.value.skill ?? [],
      }
    ).subscribe({
      next: val => {
        this.submitting = false;
        this.portfoliofrom.reset()
        this.router.navigate(['/profile']);
      },
      error: err => {
        this.submitting = false;
        this.formError = 'Veuillez corriger les erreurs dans le formulaire.';
        console.log(err);
      }
    })
  }




}
