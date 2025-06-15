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
