import { Portfolio } from '@/model/portfolio';
import { Component } from '@angular/core';
import { InfoUserComponent } from "../../components/profile/info-user/info-user.component";
import { TabsComponent } from "../../components/profile/tabs/tabs.component";
import { PortfolioService } from '@/services/portfolio.service';

@Component({
  selector: 'app-profile',
  imports: [InfoUserComponent, TabsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {


  
}
