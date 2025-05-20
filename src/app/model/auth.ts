export interface LoginUser {
  email: string;
  password: string;
}
export interface Authenticate {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  token: string;
}

export interface ForgotPasswordUser {
  status: string;
}
