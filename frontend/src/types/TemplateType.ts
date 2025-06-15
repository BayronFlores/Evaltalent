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
