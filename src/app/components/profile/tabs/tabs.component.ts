import { Portfolio } from '@/model/portfolio';
import { PortfolioService } from '@/services/portfolio.service';
import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  imports: [NgFor],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {
constructor(private portofolioService : PortfolioService){}

  portfolios! : Portfolio[] 
  ngOnInit(){
    this.getMyPortofolios();
  }

  getMyPortofolios(){
    this.portofolioService.getMyPortofolios().subscribe({
      next : (response) => {
        this.portfolios = response.data
        console.log('message dans la console', this.portfolios)
      },
      error : (err) => {
        console.log(err.error);
      } 
    })
  }
}
