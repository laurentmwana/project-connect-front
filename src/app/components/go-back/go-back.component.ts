import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-go-back',
  imports: [RouterLink],
  templateUrl: './go-back.component.html',
  styleUrl: './go-back.component.css',
})
export class GoBackComponent {
  @Input() to: string = '';
  @Input() title: string = 'Retour';
}
