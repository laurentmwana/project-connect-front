import {ExperienceService} from '@/services/experience.service';
import {NgIf} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-experienceform',
  imports: [
    FormsModule, NgIf, ReactiveFormsModule
  ],
  templateUrl: './experienceform.component.html',
  styleUrl: './experienceform.component.css'
})
export class ExperienceformComponent {

  experienceService = inject(ExperienceService)
  router = inject(Router)

  successMessage = ""
  formError = '';
  formSubmitted = false
  submitting = false

  experienceForm = new FormGroup({
    position: new FormControl('', [Validators.required]),
    company: new FormControl('', [Validators.required]),
    date_start: new FormControl('', [Validators.required]),
    date_end: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  })

  onSubmit() {

    this.submitting = true;

    if (this.experienceForm.invalid) {
      this.submitting = false;
      this.formError = 'Veuillez corriger les erreurs dans le formulaire.';
      setTimeout(() => {
        this.formError = '';
      }, 5000);
      this.experienceForm.markAllAsTouched()
      return
    }

    this.experienceService.createExperience(
      {
        position: this.experienceForm.value.position ?? '',
        company: this.experienceForm.value.company ?? '',
        date_start: this.experienceForm.value.date_start ?? '',
        date_end: this.experienceForm.value.date_end ?? '',
        description: this.experienceForm.value.description ?? '',
      }
    ).subscribe({
      next: val => {
        this.submitting = false;
        this.experienceForm.reset()
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