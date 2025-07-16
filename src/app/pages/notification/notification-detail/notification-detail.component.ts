import { AuthenticatedUser } from '@/model/auth';
import { NotificationModel } from '@/model/notification';
import { TextInitialPipe } from '@/pipe/textInitial.pipe';
import { NotificationService } from '@/services/notification.service';
import { UserLocalService } from '@/services/user-local.service';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  imports: [TextInitialPipe, NgIf],
  styleUrl: './notification-detail.component.css',
})
export class NotificationDetailComponent {
  user: AuthenticatedUser | null = null;
  notification: NotificationModel | null = null;
  isPending = true;

  constructor(
    private notificationService: NotificationService,
    private userLocalService: UserLocalService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.user = this.userLocalService.getUser();

    this.loadNotifications();
  }

  loadNotifications() {
    this.notification = null;

    if (!this.user) {
      this.isPending = false;

      return;
    }

    this.activatedRoute.snapshot.paramMap.get('id');
    const notificationId = this.activatedRoute.snapshot.paramMap.get('id');

    if (!notificationId) {
      console.error('Notification ID is required');
      this.isPending = false;
      throw new Error('Notification ID is required');
    }

    this.isPending = true;

    this.notificationService
      .find(this.user, notificationId)
      .then((observable) => {
        observable.subscribe({
          next: (response) => {
            this.notification = response as NotificationModel;
            this.isPending = false;
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.status === 401) {
              this.userLocalService.removeUser();
            }
            console.error(errorResponse.message, errorResponse.status);
          },
          complete: () => {
            this.isPending = false;
          },
        });
      })
      .catch(() => {
        this.isPending = false;
      });
  }
}
