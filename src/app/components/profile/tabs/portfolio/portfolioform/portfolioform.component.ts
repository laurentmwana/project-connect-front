import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '@/services/portfolio.service';

@Component({
  selector: 'app-portfolioform',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './portfolioform.component.html',
})
export class PortfolioformComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() refreshPortfolios = new EventEmitter<void>();

  portfolioService = inject(PortfolioService);
  fb = inject(FormBuilder);

  successMessage = '';
  formError = '';
  formSubmitted = false;
  submitting = false;

  newSkill = '';

  skillSuggestions: string[] = [
    'Angular',
    'Laravel',
    'Flutter',
    'PHP',
    'JavaScript',
    'TypeScript',
    'MySQL',
    'Node.js',
    'HTML',
    'CSS',
    'Python',
    'Vue.js',
    'React',
    'Docker',
    'Git',
    'Figma',
    'Express.js',
    'MongoDB',
    'Tailwind CSS',
  ];

  portfolioForm = this.fb.group({
    nom: ['', Validators.required],
    description: ['', Validators.required],
    lien: ['', Validators.required],
    competences: this.fb.array([]),
  });

  get competences(): FormArray {
    return this.portfolioForm.get('competences') as FormArray;
  }

  addCompetence(skill: string) {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !this.competences.value.includes(trimmedSkill)) {
      this.competences.push(new FormControl(trimmedSkill));
      this.newSkill = '';
    }
  }

  removeCompetence(index: number) {
    this.competences.removeAt(index);
  }

  close() {
    this.closeModal.emit();
  }

  onSubmit() {
    this.submitting = true;
    this.formSubmitted = true;

    if (this.portfolioForm.invalid) {
      this.submitting = false;
      this.formError = 'Veuillez corriger les erreurs dans le formulaire.';
      this.portfolioForm.markAllAsTouched();
      return;
    }

    this.portfolioService
      .createPortfolio({
        name: this.portfolioForm.value.nom ?? '',
        description: this.portfolioForm.value.description ?? '',
        link: this.portfolioForm.value.lien ?? '',
        skill: this.competences.value,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Portfolio enregistré avec succès.';
          this.portfolioForm.reset();
          this.formSubmitted = false;
          this.competences.clear();
          this.refreshPortfolios.emit();
          this.closeModal.emit();
        },
        error: (err) => {
          this.submitting = false;
          this.formError = "Une erreur s'est produite. Veuillez réessayer.";
          console.error(err);
        },
      });
  }
}
