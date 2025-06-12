import { Project } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { NgFor, NgIf } from '@angular/common';
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
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
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
    this.projectService.getAvailableDomains().subscribe((response) => {
      this.availableDomains = response.data.map((domain) => domain.name);
    });

    this.projectService.getAvailableRoles().subscribe((response) => {
      this.availableRoles = response.data.map((role) => role.name);
    });

    this.projectService.getAvaillableSkills().subscribe((response) => {
      this.availableSkills = response.data.map((skill) => skill.name);
    });
  }

  loadProjectData(): void {
    this.projectService.getProject(this.projectId).subscribe({
      next: (response) => {
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

  populateForm(project: Project): void {
    // Populate basic fields
    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      date_start: '',
      date_end: '',
      budget: project.budget,
      location: project.location,
      visibility: project.visibility,
      domains: project.domains || [],
    });

    // Clear existing role_skills array
    while (this.roleSkillsArray.length) {
      this.roleSkillsArray.removeAt(0);
    }
    this.newSkills = [];

    // Populate role_skills array
    if (project.role_skills && project.role_skills.length > 0) {
      project.role_skills.forEach((roleSkill: any) => {
        const roleSkillGroup = this.fb.group({
          role: [roleSkill.role || '', Validators.required],
          skill: [roleSkill.skill || []],
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
    console.log('Formulaire de modification soumis:', this.projectForm.value);

    if (this.projectForm.invalid) {
      this.formError = 'Veuillez corriger les erreurs dans le formulaire.';
      setTimeout(() => {
        this.formError = '';
      }, 5000);
      return;
    }

    this.submitting = true;

    const data: Project = this.projectForm.value;

    // Use updateProject instead of createProject
    this.projectService.updateProject(this.projectId, data).subscribe({
      next: (response) => {
        console.log(this.projectForm.value);
        console.log('Projet modifié avec succès:', response);
        this.submitting = false;
        this.successMessage = 'Projet modifié avec succès!';
        setTimeout(() => {
          this.successMessage = '';
          // Optionally navigate back to project details or list
          // this.router.navigate(['/projects', this.projectId]);
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la modification du projet:', error);
        this.formError =
          'Une erreur est survenue lors de la modification du projet.';
        this.submitting = false;
      },
    });
  }

  toggleDomain(domain: string): void {
    const currentDomains = this.projectForm.get('domains')?.value || [];
    const domainsArray = Array.isArray(currentDomains) ? currentDomains : [];

    // On extrait les noms de domaine pour la comparaison
    const domainNames = domainsArray.map((d: any) =>
      typeof d === 'string' ? d : d.name
    );

    if (domainNames.includes(domain)) {
      // On retire le domaine, qu'il soit objet ou string
      const newDomains = domainsArray.filter((d: any) => {
        const name = typeof d === 'string' ? d : d.name;
        return name !== domain;
      });
      this.projectForm.patchValue({ domains: newDomains });
    } else {
      // On ajoute le domaine sous forme de string
      this.projectForm.patchValue({ domains: [...domainNames, domain] });
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

  // Optional: Cancel edit and navigate back
  onCancel(): void {
    this.router.navigate(['/projects', this.projectId]);
  }
}
