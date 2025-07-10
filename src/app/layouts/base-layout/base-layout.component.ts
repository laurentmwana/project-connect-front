import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "@/components/footer/footer.component";

@Component({
  selector: 'app-base-layout',
  imports: [NavbarComponent, RouterOutlet, FooterComponent],
  templateUrl: './base-layout.component.html',
})
export class BaseLayoutComponent {}
