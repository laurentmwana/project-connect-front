export interface ToasterModel {
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ToastItemModel {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number; // Optional duration in milliseconds
  created_at?: Date; // Optional creation date
}

export interface Toaster {
  addToast(toast: ToastItemModel): void;
  removeToast(id: string): void;
  getToasts(): ToastItemModel[];
}

export interface ToastItemModel {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number; // Optional duration in milliseconds
  created_at?: Date; // Optional creation date
}
