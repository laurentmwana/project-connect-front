export interface Invitation {
  id: number;
  email: string;
  project_role: {
    id: number;
    role: {
      id: number;
      name: string;
    };
  };
  status: string;
  created_at: string;
}
export interface PaginatedInvitationResponse {
  data: Invitation[];
  meta: Meta;
  totals_by_role: { [roleName: string]: number };
}

export interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
