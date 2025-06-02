export interface ValidationServerResult {
  message: string;
  errors: FieldErrors;
}

export interface FieldErrors {
  [key: string]: string[];
}
