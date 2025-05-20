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

export interface PasswordResetUser {
  status: string;
}

export interface PasswordResetData {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}
