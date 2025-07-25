import { Component, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PortfolioService } from '@/services/portfolio.service';

@Component({
  selector: 'app-portfolioform',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, FormsModule],
  templateUrl: './portfolioform.component.html',
  styleUrl: './portfolioform.component.css',
})
export class PortfolioformComponent {
  portfolioService = inject(PortfolioService);
  router = inject(Router);
  fb = inject(FormBuilder);

  successMessage = '';
  formError = '';
  formSubmitted = false;
  submitting = false;

  newSkill = '';
  skillSuggestions: string[] = [
    // 🔹 Frontend
    'HTML',
    'CSS',
    'JavaScript',
    'TypeScript',
    'React',
    'Vue.js',
    'Angular',
    'Svelte',
    'Next.js',
    'Nuxt.js',
    'Tailwind CSS',
    'Bootstrap',
    'Figma (intégration)',

    // 🔹 Backend
    'PHP',
    'Laravel',
    'Symfony',
    'Node.js',
    'Express.js',
    'Python',
    'Django',
    'Flask',
    'Java',
    'Spring Boot',
    '.NET Core',
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'API REST',
    'GraphQL',
    'JWT',

    // 🔹 Mobile
    'Flutter',
    'React Native',
    'Kotlin',
    'Swift',
    'Dart',
    'Xamarin',

    // 🔹 IA / Data
    'Python',
    'TensorFlow',
    'PyTorch',
    'Scikit-learn',
    'Keras',
    'Pandas',
    'Numpy',
    'Computer Vision',
    'NLP',
    'Data Mining',
    'Big Data',
    'MLflow',
    'Data Visualization',
    'Prompt Engineering',

    // 🔹 DevOps / Cloud
    'Docker',
    'Kubernetes',
    'GitHub Actions',
    'Jenkins',
    'GitLab CI/CD',
    'AWS',
    'Azure',
    'Google Cloud',
    'Terraform',
    'Linux',
    'Bash',

    // 🔹 UI/UX / Design
    'Figma',
    'Adobe XD',
    'Sketch',
    'Illustrator',
    'Photoshop',
    'Design Thinking',
    'Wireframing',
    'Prototypage',

    // 🔹 Gestion / Produit
    'Agile Scrum',
    'Jira',
    'Trello',
    'Gestion de projet',
    'Analyse fonctionnelle',
    'Conduite de réunion',
    'User Stories',
    'Product Roadmap',
    'Communication',
    'Leadership',
  ];

  portfoliofrom = this.fb.group({
    nom: ['', Validators.required],
    description: ['', Validators.required],
    lien: ['', Validators.required],
    competences: this.fb.array([]), // ← FormArray pour les compétences
  });

  get competences(): FormArray {
    return this.portfoliofrom.get('competences') as FormArray;
  }

  addCompetence(skill: string) {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !this.competences.value.includes(trimmedSkill)) {
      this.competences.push(new FormControl(trimmedSkill));
      this.newSkill = ''; // reset champ
    }
  }

  removeCompetence(index: number) {
    this.competences.removeAt(index);
  }

  onSubmit() {
    this.submitting = true;
    this.formSubmitted = true;

    if (this.portfoliofrom.invalid) {
      this.submitting = false;
      this.formError = 'Veuillez corriger les erreurs dans le formulaire.';
      setTimeout(() => {
        this.formError = '';
      }, 5000);
      this.portfoliofrom.markAllAsTouched();
      return;
    }

    this.portfolioService
      .createPortfolio({
        name: this.portfoliofrom.value.nom ?? '',
        description: this.portfoliofrom.value.description ?? '',
        link: this.portfoliofrom.value.lien ?? '',
        skill: this.competences.value,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Portfolio enregistré avec succès.';
          this.portfoliofrom.reset();
          this.formSubmitted = false;
          this.competences.clear();
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        },
        error: (err) => {
          this.submitting = false;
          this.formError = "Une erreur s'est produite. Veuillez réessayer.";
          console.error(err);
        },
      });
  }
}
