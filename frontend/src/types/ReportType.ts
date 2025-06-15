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
