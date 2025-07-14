export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  token: string;
  role: string;
}

export interface ForgotPasswordResponse {
  status: string;
}

export interface ResetPasswordResponse {
  status: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  token?: string;
}

export interface EmailVerificationStatus {
  status: 'verification-link-success' | 'verification-link-already';
}
