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
