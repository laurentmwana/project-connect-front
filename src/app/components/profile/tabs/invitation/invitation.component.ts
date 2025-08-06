import { Component, OnInit } from '@angular/core';
import { InvitationService } from '@/services/invitation.service';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-invitation',
  imports: [NgIf,NgFor],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css',
})
export class InvitationComponent implements OnInit {
  invitations: any[] = [];
  loading = true;

  constructor(private invitationService: InvitationService) {}

  ngOnInit(): void {
    this.invitationService.getUserInvitations().subscribe({
      next: (res) => {
        this.invitations = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  respond(candidacyId: number, status: 'accepted' | 'declined') {
    this.invitationService.respondToInvitation(candidacyId, status).subscribe({
      next: () => {
        this.invitations = this.invitations.filter((i) => i.id !== candidacyId);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
