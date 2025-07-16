import { AuthenticatedUser } from '@/model/auth';
import { NotificationModel, NotificationPaginate } from '@/model/notification';
import { TextInitialPipe } from '@/pipe/textInitial.pipe';
import { NotificationService } from '@/services/notification.service';
import { UserLocalService } from '@/services/user-local.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-notifications',
  imports: [NgIf, NgFor, TextInitialPipe, NgClass],
  templateUrl: './notification-list.component.html',
})
export class NotificationListComponent implements OnDestroy {
  notifications: NotificationPaginate | null = null;
  isPending = true;
  filterColumns = ['all', 'unread'];
  filterBy: string = 'all';
  skeletonItems = Array(5).fill(0);
  private destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private userLocalService: UserLocalService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const filter = params.get('filter') ?? 'all';
        this.handleFilterChange(filter);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleFilterChange(filter: string) {
    if (filter && !this.filterColumns.includes(filter)) {
      console.error('Invalid filter:', filter);
      this.router.navigate([], {
        queryParams: { filter: 'all' },
        replaceUrl: true,
      });
      return;
    }

    this.filterBy = filter;
    this.loadNotifications(this.filterBy);
  }

  get isAuthenticated(): boolean {
    return this.user !== null;
  }

  get hasNotifications(): boolean {
    return !!this.notifications?.data?.length;
  }

  get isFilterUnread(): boolean {
    return this.filterBy === 'unread';
  }

  get isFilterAll(): boolean {
    return this.filterBy === 'all';
  }

  get unreadCount(): number {
    return this.notifications?.counts?.unread_notifications ?? 0;
  }

  get user(): AuthenticatedUser | null {
    return this.userLocalService.getUser();
  }

  loadNotifications(filterBy: string = 'all') {
    if (!this.user) {
      this.isPending = false;
      return;
    }

    this.notifications = null;
    this.isPending = true;

    this.notificationService
      .findAll(this.user, filterBy)
      .then((observable) => {
        observable.pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            this.notifications = response as NotificationPaginate;

            console.log('Notifications loaded:', this.notifications);
            this.isPending = false;
          },
          error: (error: HttpErrorResponse) => {
            this.handleError(error);
          },
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  private handleError(error: HttpErrorResponse) {
    this.isPending = false;

    if (error.status === 401) {
      this.userLocalService.removeUser();
    }

    console.error('Notification error:', error.message);
  }

  markAllAsRead() {
    if (!this.user) {
      return;
    }

    this.isPending = true;

    this.notificationService
      .markAsRead(this.user)
      .then((observable) => {
        observable.pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.loadNotifications(this.filterBy);
          },
          error: (error: HttpErrorResponse) => {
            this.handleError(error);
          },
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  }
}
