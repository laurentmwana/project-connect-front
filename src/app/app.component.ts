import { Component } from '@angular/core';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { initFlowbite } from 'flowbite';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [BaseLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  ngOnInit(): void {
    initFlowbite();
  }
}
