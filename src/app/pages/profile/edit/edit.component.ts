import { GoBackComponent } from '@/components/go-back/go-back.component';
import { ChangePasswordComponent } from '@/components/profile/change-password/change-password.component';
import { EditInfoComponent } from '@/components/profile/edit-info/edit-info.component';
import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

type ProfileEditTarget = 'info' | 'security';

@Component({
  selector: 'app-edit',
  imports: [
    GoBackComponent,
    RouterLink,
    EditInfoComponent,
    ChangePasswordComponent,
    NgIf,
    NgClass,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  target: ProfileEditTarget = 'info';

  targetKeys = ['info', 'security'];

  private sub!: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.sub = this.activatedRoute.queryParamMap.subscribe((params) => {
      const target = params.get('target');

      if (this.targetKeys.includes(target as ProfileEditTarget)) {
        this.target = target as ProfileEditTarget;
      } else {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { target: 'info' },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
