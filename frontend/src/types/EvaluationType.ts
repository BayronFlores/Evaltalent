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
