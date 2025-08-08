import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { ProjectService } from '@/services/project.service';
import { Project } from '@/model/project';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { GoBackComponent } from '@/components/go-back/go-back.component';

@Component({
  selector: 'app-create',
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor, GoBackComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {
  projectForm: FormGroup;

  availableDomains: string[] = [];
  availableRoles: string[] = [];
  availableSkills: string[] = [];

  newSkills: string[] = [];

  submitting = false;
  formSubmitted = false;
  formError = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router
  ) {
    this.projectForm = this.fb.group(
      {
        title: ['', Validators.required],
        description: ['', Validators.required],
        date_start: ['', Validators.required],
        date_end: ['', Validators.required],
        budget: [0, [Validators.required, Validators.min(0)]],
        location: ['', Validators.required],
        visibility: ['public', Validators.required],
        domains: [[], this.atLeastOneDomainValidator],
        role_skills: this.fb.array([]),
      },
      { validators: [this.dateRangeValidator] }
    );
    this.newSkills = [];
  }
  private atLeastOneDomainValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;
    return Array.isArray(value) && value.length > 0
      ? null
      : { atLeastOneDomain: true };
  }
  private dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('date_start')?.value;
    const end = group.get('date_end')?.value;

    if (start && end && new Date(start) > new Date(end)) {
      return { invalidDateRange: true };
    }

    return null;
  }
  ngOnInit(): void {
    this.loadFormData();

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10);

    this.projectForm.patchValue({
      date_start: formattedDate,
      date_end: formattedDate,
    });
    this.projectForm.valueChanges.subscribe(() => {
      if (this.formError) {
        this.formError = '';
      }
    });
  }

  loadFormData(): void {
    this.projectService.getAvailableDomains().subscribe((response) => {
      this.availableDomains = response.data.map((domain) => domain.name);
      console.log(this.availableDomains);
    });

    this.projectService.getAvailableRoles().subscribe((response) => {
      this.availableRoles = response.data.map((role) => role.name);
      console.log(this.availableRoles);
    });

    // Charger les compétences
    this.projectService.getAvaillableSkills().subscribe((response) => {
      this.availableSkills = response.data.map((skill) => skill.name);
      console.log(this.availableSkills);
    });
  }

  get roleSkillsArray(): FormArray {
    return this.projectForm.get('role_skills') as FormArray;
  }

  addRoleSkill(): void {
    const roleSkillGroup = this.fb.group({
      role: ['', Validators.required],
      skill: [[]],
      description: [''],
    });

    this.roleSkillsArray.push(roleSkillGroup);
    this.newSkills.push('');
  }

  removeRoleSkill(index: number): void {
    this.roleSkillsArray.removeAt(index);
    this.newSkills.splice(index, 1);
  }

  onRoleChange(index: number, role: string): void {
    const roleSkillGroup = this.roleSkillsArray.at(index);
    if (roleSkillGroup) {
      roleSkillGroup.patchValue({ role: role, skill: [] });
    }
  }

  addSkillToRole(index: number): void {
    const newSkill = this.newSkills[index];
    if (!newSkill || newSkill.trim() === '') return;

    const roleSkillGroup = this.roleSkillsArray.at(index);
    if (!roleSkillGroup) return;

    const currentSkills = roleSkillGroup.get('skill')?.value || [];

    if (!currentSkills.includes(newSkill)) {
      roleSkillGroup.patchValue({ skill: [...currentSkills, newSkill] });
    }

    this.newSkills[index] = '';
  }

  removeSkillFromRole(roleIndex: number, skill: string): void {
    const roleSkillGroup = this.roleSkillsArray.at(roleIndex);
    if (!roleSkillGroup) return;

    const currentSkills = roleSkillGroup.get('skill')?.value || [];

    roleSkillGroup.patchValue({
      skill: currentSkills.filter((s: string) => s !== skill),
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    console.log('Formulaire soumis:', this.projectForm.value);

    if (this.projectForm.invalid) {
      this.formError = 'Veuillez corriger les erreurs dans le formulaire.';
      setTimeout(() => {
        this.formError = '';
      }, 5000);
      return;
    }

    this.submitting = true;

    const data: Project = this.projectForm.value;

    this.projectService.createProject(data).subscribe({
      next: (response) => {
        console.log('Projet créé avec succès:', response);
        this.submitting = false;
        this.successMessage = 'Projet créé avec succès!';
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);

        this.resetForm();
        this.router.navigate(['/project', response.data.id]);
      },
      error: (error) => {
        console.error('Erreur lors de la création du projet:', error);
        this.formError =
          'Une erreur est survenue lors de la création du projet.';
        this.submitting = false;
      },
    });
  }

  resetForm(): void {
    this.projectForm.reset({
      visibility: 'private',
      location: 'Remote',
      budget: 0,
      domains: [],
    });

    while (this.roleSkillsArray.length) {
      this.roleSkillsArray.removeAt(0);
    }

    this.newSkills = [];
    this.formSubmitted = false;
    this.formError = '';

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16);

    this.projectForm.patchValue({
      date_start: formattedDate,
      date_end: formattedDate,
    });
  }

  toggleDomain(domain: string): void {
    const currentDomains = this.projectForm.get('domains')?.value || [];

    if (currentDomains.includes(domain)) {
      this.projectForm.patchValue({
        domains: currentDomains.filter((d: string) => d !== domain),
      });
    } else {
      this.projectForm.patchValue({
        domains: [...currentDomains, domain],
      });
    }
  }

  isDomainSelected(domain: string): boolean {
    const currentDomains = this.projectForm.get('domains')?.value || [];
    return currentDomains.includes(domain);
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSkillToRole(index);
    }
  }
}
