export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  state: number;
}

export interface PaginatedUsers {
  data: User[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: Meta;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
}
