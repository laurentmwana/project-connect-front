import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExperienceService } from '@/services/experience.service';
import { Experience } from '@/model/experience';

@Component({
  selector: 'app-experienceform',
  templateUrl: './experienceform.component.html',
  imports: [NgIf, ReactiveFormsModule],
})
export class ExperienceFormComponent {
  @Input() onSuccess!: () => void;
  @Input() isOpen = false;
  @Input() setIsOpen!: (value: boolean) => void;

  experienceForm: FormGroup;
  formSubmitted = false;
  successMessage = '';
  formError = '';
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private experienceService: ExperienceService
  ) {
    this.experienceForm = this.fb.group(
      {
        position: ['', Validators.required],
        company: ['', Validators.required],
        description: ['', Validators.required],
        date_start: ['', Validators.required],
        date_end: ['', Validators.required],
      },
      { validators: this.dateRangeValidator }
    );
  }

  dateRangeValidator(group: FormGroup) {
    const start = new Date(group.get('date_start')?.value);
    const end = new Date(group.get('date_end')?.value);
    return end >= start ? null : { invalidDateRange: true };
  }

  close() {
    if (this.setIsOpen) {
      this.setIsOpen(false);
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    this.formError = '';
    this.successMessage = '';

    if (this.experienceForm.invalid) return;

    this.submitting = true;

    const experienceData: Experience = this.experienceForm.value;

    this.experienceService.createExperience(experienceData).subscribe({
      next: (res) => {
        this.submitting = false;
        this.successMessage = 'Expérience enregistrée avec succès !';
        this.experienceForm.reset();
        this.formSubmitted = false;

        if (this.onSuccess) this.onSuccess();
        if (this.setIsOpen) this.setIsOpen(false);
      },
      error: (err) => {
        this.submitting = false;
        this.formError = "Une erreur est survenue lors de l'enregistrement.";
        console.error(err);
      }
    });
  }
}
