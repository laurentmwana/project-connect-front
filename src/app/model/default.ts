export interface ValidationServerResult {
  message: string;
  errors: FieldErrors;
}

export interface FieldErrors {
  [key: string]: string[];
}

export interface PaginateResponse {
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: 1;
    from: 1;
    last_page: 1;
    links: {
      url: null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
