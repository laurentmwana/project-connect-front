import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';

import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../model/project';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-create',
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {
  projectForm: FormGroup;

  availableDomains: string[] = [];
  availableRoles: string[] = [];
  skillsByRole: Record<string, string[]> = {};

  newSkills: string[] = [];

  submitting = false;
  formSubmitted = false;
  formError = '';

  constructor(private fb: FormBuilder, private projectService: ProjectService) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date_start: ['', Validators.required],
      date_end: ['', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]],
      location: ['Remote', Validators.required],
      visibility: ['private', Validators.required],
      domains: [[]],
      role_skills: this.fb.array([]),
    });
    this.newSkills = [];
  }

  ngOnInit(): void {
    this.loadFormData();

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16);

    this.projectForm.patchValue({
      date_start: formattedDate,
      date_end: formattedDate,
    });
  }

  loadFormData(): void {
    this.projectService.getAvailableDomains().subscribe((domains) => {
      this.availableDomains = domains;
    });

    this.projectService.getAvailableRoles().subscribe((roles) => {
      this.availableRoles = roles;

      // Charger les compétences pour chaque rôle après avoir récupéré les rôles
      roles.forEach((role) => {
        this.projectService.getSkillsByRole(role).subscribe((skills) => {
          this.skillsByRole[role] = skills;
        });
      });
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
      return;
    }

    this.submitting = true;

    const projectData: Project = this.projectForm.value;

    this.projectService.createProject(projectData).subscribe({
      next: (response) => {
        console.log('Projet créé avec succès:', response);
        this.submitting = false;
        alert('Projet créé avec succès!');
        this.resetForm();
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
