import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FollowButtonComponent } from "../../follow-button/follow-button.component";

@Component({
  selector: 'app-info-user',
  imports: [FollowButtonComponent],
  templateUrl: './info-user.component.html',
  styleUrl: './info-user.component.css'
})
export class InfoUserComponent {
  // Déclare les propriétés utilisées dans ton template
  // userId: number = 123; // Ou récupère cette valeur dynamiquement
  // initialIsFollowing: boolean = false;

  // Gestionnaire de l'événement followChange (optionnel)
  // onFollowChange(isFollowing: boolean) {
  //   console.log('Follow status changed:', isFollowing);
  //   // Tu peux faire ce que tu veux avec cette info, par exemple mettre à jour une variable
  // }
  @Input() userId: number = 0;
  @Input() initialIsFollowing: boolean = false;

  @Output() followChange = new EventEmitter<boolean>();
  @Output() messageClick = new EventEmitter<string>(); // Nouvel événement

  onMessageClick() {
    // Émettre l'événement vers le composant parent
    this.messageClick.emit(this.userId.toString());

  }

  onFollowChange(isFollowing: boolean) {
    this.followChange.emit(isFollowing);
  }
}
