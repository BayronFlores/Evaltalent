// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  position: string;
  managerId?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export const UserRole = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Evaluation types
export interface Evaluation {
  id: string;
  title: string;
  description: string;
  evaluatorId: string;
  evaluatedId: string;
  cycleId: string;
  status: EvaluationStatus;
  startDate: string;
  endDate: string;
  responses: EvaluationResponse[];
  overallScore?: number;
  createdAt: string;
  updatedAt: string;
}

export const EvaluationStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
} as const;

export type EvaluationStatus =
  (typeof EvaluationStatus)[keyof typeof EvaluationStatus];

export interface EvaluationResponse {
  questionId: string;
  value: number | string;
  comment?: string;
}

// Evaluation Cycle types
export interface EvaluationCycle {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: CycleStatus;
  templateId: string;
  participants: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const CycleStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export type CycleStatus = (typeof CycleStatus)[keyof typeof CycleStatus];

// Template types
export interface EvaluationTemplate {
  id: string;
  name: string;
  description: string;
  sections: TemplateSection[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  weight: number;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  minValue?: number;
  maxValue?: number;
  weight: number;
}

export const QuestionType = {
  RATING: 'rating',
  TEXT: 'text',
  MULTIPLE_CHOICE: 'multiple_choice',
  YES_NO: 'yes_no',
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

// Report types
export interface Report {
  id: string;
  title: string;
  type: ReportType;
  userId?: string;
  departmentId?: string;
  cycleId?: string;
  data: any;
  generatedBy: string;
  createdAt: string;
}

export const ReportType = {
  INDIVIDUAL: 'individual',
  DEPARTMENT: 'department',
  COMPANY: 'company',
  COMPARISON: 'comparison',
} as const;

export type ReportType = (typeof ReportType)[keyof typeof ReportType];

// Dashboard types
export interface DashboardStats {
  totalEmployees: number;
  activeEvaluations: number;
  completedEvaluations: number;
  averageScore: number;
  pendingEvaluations: number;
  overdueEvaluations: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  change: number;
  period: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface EvaluationForm {
  responses: Record<string, any>;
  comments?: Record<string, string>;
}

// Navigation types
export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  current: boolean;
  children?: NavigationItem[];
}
