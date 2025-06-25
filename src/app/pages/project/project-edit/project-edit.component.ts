import { Domain } from '@/model/domain';
import { Project, ProjectRoleSkill, Skill } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { NgFor, NgIf, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-edit',
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor],
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.css',
})
export class ProjectEditComponent {
  projectForm: FormGroup;
  projectId: string = '';

  availableDomains: string[] = [];
  availableRoles: string[] = [];
  availableSkills: string[] = [];

  newSkills: string[] = [];

  submitting = false;
  loading = true;
  formSubmitted = false;
  formError = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
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
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      console.log('id du projet:', this.projectId);

      if (this.projectId) {
        this.loadFormData();
        this.loadProjectData();
      } else {
        this.formError = 'ID du projet manquant';
        this.loading = false;
      }
    });

    this.projectForm.valueChanges.subscribe(() => {
      if (this.formError) {
        this.formError = '';
      }
    });
  }

  loadFormData(): void {
    console.log('Loading form data...');

    this.projectService.getAvailableDomains().subscribe({
      next: (response) => {
        this.availableDomains = response.data.map((domain) => domain.name);
        console.log('Available domains loaded:', this.availableDomains);
      },
      error: (error) => {
        console.error('Error loading domains:', error);
      },
    });

    this.projectService.getAvailableRoles().subscribe({
      next: (response) => {
        this.availableRoles = response.data.map((role) => role.name);
        console.log('Available roles loaded:', this.availableRoles);
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      },
    });

    this.projectService.getAvaillableSkills().subscribe({
      next: (response) => {
        this.availableSkills = response.data.map((skill) => skill.name);
        console.log('Available skills loaded:', this.availableSkills);
      },
      error: (error) => {
        console.error('Error loading skills:', error);
      },
    });
  }

  loadProjectData(): void {
    console.log('Loading project data for ID:', this.projectId);

    this.projectService.getProject(this.projectId).subscribe({
      next: (response) => {
        console.log('Project data received:', response.data);
        const project = response.data;
        this.populateForm(project);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du projet:', error);
        this.formError = 'Erreur lors du chargement du projet';
        this.loading = false;
      },
    });
  }

  populateForm(project: any): void {
    const domains = project.domains.map((d: Domain) => d.name);

    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      date_start: project.date_start,
      date_end: project.date_end,
      budget: project.budget || 0,
      location: project.location,
      visibility: project.visibility,
      domains: domains,
    });

    while (this.roleSkillsArray.length) {
      this.roleSkillsArray.removeAt(0);
    }
    this.newSkills = [];

    if (
      project.project_roles_skills &&
      project.project_roles_skills.length > 0
    ) {
      project.project_roles_skills.forEach((roleSkill: ProjectRoleSkill) => {
        const skills = roleSkill.skills.map((s: Skill) => s.name);

        const roleSkillGroup = this.fb.group({
          role: [roleSkill.role.name, Validators.required],
          skill: [skills],
          description: [roleSkill.description || ''],
        });

        this.roleSkillsArray.push(roleSkillGroup);
        this.newSkills.push('');
      });
    }
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

    const roleSkillGroup = this.roleSkillsArray.at(index) as FormGroup;
    if (!roleSkillGroup) return;

    const currentSkills: string[] = roleSkillGroup.get('skill')?.value || [];

    if (!currentSkills.includes(newSkill)) {
      roleSkillGroup.patchValue({ skill: [...currentSkills, newSkill] });
    }

    this.newSkills[index] = '';
  }

  removeSkillFromRole(roleIndex: number, skill: string): void {
    const roleSkillGroup = this.roleSkillsArray.at(roleIndex) as FormGroup;
    if (!roleSkillGroup) return;

    const currentSkills: string[] = roleSkillGroup.get('skill')?.value || [];

    roleSkillGroup.patchValue({
      skill: currentSkills.filter((s: string) => s !== skill),
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.projectForm.invalid) {
      this.formError = 'Veuillez corriger les erreurs dans le formulaire.';
      setTimeout(() => {
        this.formError = '';
      }, 5000);
      return;
    }

    this.submitting = true;

    const data: Project = this.projectForm.value;

    this.projectService.updateProject(this.projectId, data).subscribe({
      next: (response) => {
        console.log('Project updated successfully:', response);
        this.submitting = false;
        this.successMessage = 'Projet modifié avec succès!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        this.location.back();
      },
      error: (error) => {
        console.error('Error updating project:', error);
        this.formError =
          'Une erreur est survenue lors de la modification du projet.';
        this.submitting = false;
      },
    });
  }
  isDomainSelected(domain: string): boolean {
    const currentDomains: string[] =
      this.projectForm.get('domains')?.value || [];
    return currentDomains.includes(domain);
  }

  toggleDomain(domain: string): void {
    const currentDomains: string[] =
      this.projectForm.get('domains')?.value || [];

    if (currentDomains.includes(domain)) {
      const newDomains = currentDomains.filter((d: string) => d !== domain);
      this.projectForm.patchValue({ domains: newDomains });
    } else {
      this.projectForm.patchValue({ domains: [...currentDomains, domain] });
    }
  }
  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter') {
      event.preventDefault();

      this.addSkillToRole(index);
    }
  }

  onCancel(): void {
    this.location.back();
  }
}
