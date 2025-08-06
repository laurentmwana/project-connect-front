import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { Portfolio } from '@/model/portfolio';
import { PortfolioService } from '@/services/portfolio.service';
import { PortfolioformComponent } from '../portfolioform/portfolioform.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [NgFor, RouterLink, PortfolioformComponent,CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent {
  portfolios!: Portfolio[];
  showPortfolioModal = false;

  constructor(private portofolioService: PortfolioService) {}

  ngOnInit() {
    this.getMyPortofolios();
  }

  toggleModal(open: boolean) {
    this.showPortfolioModal = open;
  }

  onPortfolioAdded() {
    this.getMyPortofolios();
    this.toggleModal(false); // Ferme le modal après ajout
  }

  getMyPortofolios() {
    this.portofolioService.getMyPortofolios().subscribe({
      next: (response) => {
        this.portfolios = response.data;
        console.log('message dans la console', this.portfolios);
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }
}