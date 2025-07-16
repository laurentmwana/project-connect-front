import { PaginateResponse } from './default';

export interface NotificationModel {
  id: string;
  data: {
    title: string;
    message: string;
    link: string;
    [key: string]: string | number | boolean | undefined;
  };
  read_at: string | null;
  created_at: string;
}

export interface NotificationPaginate extends PaginateResponse {
  data: NotificationModel[];
  counts: {
    all_notifications: number;
    unread_notifications: number;
  };
}
