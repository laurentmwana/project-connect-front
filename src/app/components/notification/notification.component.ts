import { AuthenticatedUser } from '@/model/auth';
import { NotificationModel } from '@/model/notification';
import { TextInitialPipe } from '@/pipe/textInitial.pipe';
import { NotificationService } from '@/services/notification.service';
import { UserLocalService } from '@/services/user-local.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  imports: [NgIf, NgFor, TextInitialPipe, NgClass],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  notifications: NotificationModel[] = [];
  isPending = true;
  skeletonItems = Array(5).fill(0);

  constructor(
    private notificationService: NotificationService,
    private userLocalService: UserLocalService
  ) {}

  get unreadCount(): number {
    return this.notifications.filter((n) => n.read_at === null).length;
  }

  get hasUnreadNotifications(): boolean {
    return this.unreadCount > 0;
  }

  get isAuthenticated(): boolean {
    return this.user !== null;
  }

  get user(): AuthenticatedUser | null {
    return this.userLocalService.getUser();
  }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    if (!this.user) {
      this.isPending = false;

      return;
    }

    this.isPending = true;
    this.notificationService
      .findLast(this.user)
      .then((observable) => {
        observable.subscribe({
          next: (response) => {
            const notifications = (
              response as {
                data: NotificationModel[];
              }
            ).data;
            this.notifications = notifications;
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

  markAllAsRead() {
    if (!this.user) {
      this.isPending = false;

      return;
    }

    this.notificationService
      .markAsRead(this.user)
      .then((observable) => {
        observable.subscribe({
          next: (response) => {
            const { status } = response as { status: number };
            if (status === 200) {
              this.loadNotifications();
            }
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
