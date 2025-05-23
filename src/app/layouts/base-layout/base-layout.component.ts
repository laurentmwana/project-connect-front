import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-base-layout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './base-layout.component.html',
})
export class BaseLayoutComponent {}
