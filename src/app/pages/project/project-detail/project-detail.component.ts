import { ProjectData } from '@/model/project';
import { ProjectService } from '@/services/project.service';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { CandidacyService } from '@/services/candidacy.service';
import { Candidacy, Meta, PaginatedCandidacyResponse } from '@/model/candidacy';
import { UserLocalService } from '@/services/user-local.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Invitation, PaginatedInvitationResponse } from '@/model/invitation';

@Component({
  selector: 'app-project-detail',
  imports: [
    NgIf,
    NgFor,
    NavbarComponent,
    NgClass,
    FormsModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
})
export class ProjectDetailComponent {
  toggleViewMenuInvite(invitationId: number) {
    this.viewMenuOpen = !this.viewMenuOpen;
    this.selectedInvitationId =
      this.selectedInvitationId === invitationId ? null : invitationId;
  }
  selectedInvitationId: any;
  refreshInvitations() {
    if (this.isLoading) return;
    this.loadInvitations();
  }
  projectId!: string;
  project!: ProjectData;
  errorMessage = '';
  meta: Meta | null = null;
  candidacies: Candidacy[] = [];
  currentPage: number = 1;
  perPage: number = 10; // Valeur par défaut
  isOwner: boolean = false;
  isLoading: boolean = false;
  projectMenuOpen = false;
  Math: Math = Math;
  invitations: Invitation[] = [];
  candidacyMeta: Meta | null = null;
  invitationMeta: Meta | null = null;
  currentInvitationPage: number = 1;

  // Filtres
  roleFilter: string = '';
  userFilter: string = '';
  validatedFilter: number = -1;
  searchFilter: string = '';

  invitationRoleFilter: string = '';
  invitationEmailFilter: string = '';
  invitationStatusFilter: string = '';

  //invitations
  showInviteModal = false;
  selectedRole: any = null;
  inviteEmail: string = '';
  viewMenuOpen = false;
  selectedCandidacyId: number | null = null;

  activeTab: 'candidatures' | 'invitations' = 'candidatures';

  openInviteModal(role: any) {
    this.selectedRole = role;
    this.inviteEmail = '';
    this.showInviteModal = true;
  }

  cancelInvite() {
    this.showInviteModal = false;
  }

  sendInvite() {
    if (!this.inviteEmail) return;
    this.candidacyService
      .inviteCandidate(this.selectedRole.id, this.inviteEmail)
      .subscribe({
        next: (response) => {
          this.showToast("Email d'invitation envoyé avec succès.", 'success');
          this.inviteEmail = '';
          this.showInviteModal = false;
        },
        error: (err) => {
          const error = err?.error;
          this.showToast(
            error?.message || "Erreur lors de l'envoi de l'invitation.",
            'error'
          );
        },
      });
  }

  //candidacies modal

  showCandidacyModal = false;
  // Méthodes
  openCandidacyModal(role: any) {
    this.selectedRole = role;
    this.showCandidacyModal = true;
  }

  cancelCandidacy() {
    this.showCandidacyModal = false;
  }

  confirmCandidacy() {
    if (this.selectedRole?.id) {
      this.onApplyRole(this.selectedRole.id);
      this.showCandidacyModal = false;
    }
  }

  toasts: { message: string; type: 'success' | 'error' }[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private candidacyService: CandidacyService,
    private userLocalService: UserLocalService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.loadProject();
  }

  loadProject(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response) => {
        this.project = response.data;
        const user = this.userLocalService.getUser();
        this.isOwner = user?.id === this.project.created_by.id;

        if (this.isOwner) {
          this.loadCandidacies();
          this.loadInvitations();
        }
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement du projet';
        this.showToast(this.errorMessage, 'error');
      },
    });
  }

  refreshCandidacies(): void {
    if (this.isLoading) return;
    this.loadCandidacies(this.currentPage); // Recharge avec la page actuelle
  }

  loadCandidacies(page: number = this.currentPage): void {
    if (!this.isOwner) return;

    this.isLoading = true;
    this.currentPage = page;

    // Correction : on utilise les bons noms en camelCase
    const params = {
      page: this.currentPage,
      perPage: this.perPage,
      ...(this.roleFilter && { roleName: this.roleFilter }),
      ...(this.userFilter && { userName: this.userFilter }),
      ...(this.validatedFilter >= 0 && {
        isValidated: this.validatedFilter === 1,
      }),
    };

    console.log('Paramètres envoyés au backend:', params);

    this.candidacyService
      .getCandidacies(Number(this.projectId), params)
      .subscribe({
        next: (response: PaginatedCandidacyResponse) => {
          console.log('Réponse complète du backend:', response);
          console.log('Données des candidatures:', response.data);
          console.log('Métadonnées de pagination:', response.meta);

          this.candidacies = response.data;
          this.candidacyMeta = response.meta;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur reçue du backend:', error);
          console.error("Détails de l'erreur:", error.error);

          this.isLoading = false;
          this.showToast('Erreur lors du chargement des candidatures', 'error');
        },
      });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadCandidacies();
  }

  resetFilters(): void {
    this.roleFilter = '';
    this.userFilter = '';
    this.validatedFilter = -1;
    this.perPage = 10;
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.loadCandidacies(page);
  }

  onPerPageChange(): void {
    this.currentPage = 1;
    this.loadCandidacies();
  }

  onApplyRole(id: number) {
    this.candidacyService.applyForRole(id).subscribe({
      next: () => {
        this.showToast('Candidature soumise avec succès.', 'success');
        this.showCandidacyModal = false; // Ferme la modale après succès
      },
      error: (err) => {
        let error = err.error;
        this.showToast(`${error.message}`, 'error');
      },
    });
  }

  showToast(message: string, type: 'success' | 'error'): void {
    const toast = { message, type };
    this.toasts.push(toast);
    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t !== toast);
    }, 3000);
  }

  getPageNumbers(): number[] {
    if (!this.meta) return [];

    const pages = [];
    const startPage = Math.max(1, this.meta.current_page - 2);
    const endPage = Math.min(this.meta.last_page, this.meta.current_page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  toggleProjectMenu() {
    this.projectMenuOpen = !this.projectMenuOpen;
  }

  onDeleteProject() {
    //TODO:Gerer la suppression ?
  }

  //Traitement candidature
  toggleViewMenu(candidacyId: number) {
    this.viewMenuOpen = !this.viewMenuOpen;
    this.selectedCandidacyId =
      this.selectedCandidacyId === candidacyId ? null : candidacyId;
  }

  onValidate(candidacyId: number) {
    this.candidacyService.updateCandidacy(candidacyId, 'accepted').subscribe({
      next: () => {
        this.showToast('Candidature acceptée avec succès.', 'success');
      },
      error: (err) => {
        let error = err.error;
        this.showToast(`${error.message}`, 'error');
      },
    });
    this.viewMenuOpen = false;
  }

  onReject(candidacyId: number) {
    this.candidacyService.updateCandidacy(candidacyId, 'declined').subscribe({
      next: () => {
        this.showToast('Candidature refusée avec succès.', 'error');
        this.selectedCandidacyId = null;
      },
      error: (err) => {
        let error = err.error;
        this.showToast(`${error.message}`, 'error');
        this.selectedCandidacyId = null;
      },
    });
    this.viewMenuOpen = false;
  }

  //Invitations
  // Ajouter cette méthode pour la pagination des invitations
  onInvitationPageChange(page: number): void {
    this.currentInvitationPage = page;
    this.loadInvitations(page);
  }

  // Modifier loadInvitations pour utiliser currentInvitationPage
  loadInvitations(page: number = 1) {
    if (!this.isOwner) return;

    this.isLoading = true;
    this.currentInvitationPage = page;

    // Dans loadInvitations()
    const params = {
      page: page,
      per_page: this.perPage,
      ...(this.invitationRoleFilter && { role: this.invitationRoleFilter }),
      ...(this.invitationEmailFilter && { email: this.invitationEmailFilter }),
    };

    console.log('Paramètres envoyés:', params);

    this.candidacyService
      .getInvitations(Number(this.projectId), params)
      .subscribe({
        next: (response: PaginatedInvitationResponse) => {
          this.invitations = response.data;
          this.invitationMeta = response.meta;
          console.log(
            'Invitations chargées:',
            this.invitations.length,
            'Meta:',
            this.invitationMeta
          );
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.isLoading = false;
          this.showToast('Erreur lors du chargement des invitations', 'error');
        },
      });
  }
  applyInvitationFilters(): void {
    this.currentInvitationPage = 1;
    this.loadInvitations();
  }

  resetInvitationFilters(): void {
    this.invitationRoleFilter = '';
    this.invitationEmailFilter = '';
    this.invitationStatusFilter = '';
    this.perPage = 10;
    this.applyInvitationFilters();
  }

  onInvitationPerPageChange(): void {
    this.currentInvitationPage = 1;
    this.loadInvitations();
  }
  getInvitationPageNumbers(): number[] {
    if (!this.invitationMeta) return [];

    const pages = [];
    const startPage = Math.max(1, this.invitationMeta.current_page - 2);
    const endPage = Math.min(
      this.invitationMeta.last_page,
      this.invitationMeta.current_page + 2
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  cancel(id: number) {
    this.candidacyService.cancelInvitation(id).subscribe({
      next: () => {
        this.showToast('Invitation annulée avec succès.', 'success');
        this.loadInvitations();
      },
      error: (err) => {
        let error = err.error;
        this.showToast(`${error.message}`, 'error');
      },
    });
  }

  isOpen: boolean[] = [];

  toggleAccordion(index: number): void {
    this.isOpen[index] = !this.isOpen[index];
    this.isOpen = [...this.isOpen]; // Trigger change detection
  }
}
