export interface Candidacy {
  id: number;
  is_validated: boolean;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  project_role: {
    id: number;
    description: string;
    role: {
      id: number;
      name: string;
    };
  };
}

export interface PaginatedCandidacies {
  data: Candidacy[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CandidacyFilters {
  roleName?: string;
  userName?: string;
  isValidated?: boolean;
  perPage?: number;
}
export interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedCandidacyResponse {
  data: Candidacy[];
  meta: Meta;
}