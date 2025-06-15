export interface LoginForm {
  email: string;
  password: string;
}

export interface EvaluationForm {
  responses: Record<string, any>;
  comments?: Record<string, string>;
}
