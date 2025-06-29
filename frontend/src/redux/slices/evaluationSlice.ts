import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { evaluationService } from '../../services/evaluationService';

export interface Question {
  question: string;
  type: 'yesno' | 'text' | 'rating';
}

export interface Evaluation {
  id: number;
  title: string;
  evaluatorId: string;
  evaluateeId: string;
  evaluatorName: string;
  evaluateeName: string;
  cycleName: string;
  templateName: string;
  status: string;
  score?: number;
  comments?: string;
  createdAt: string;
  updatedAt: string;

  objective?: string;
  dueDate?: string;
  templateQuestions: Question[]; // Quitar opcional para evitar undefined
  responses: { [key: string]: any }; // Quitar opcional para evitar undefined
}

interface EvaluationState {
  evaluations: Evaluation[];
  loading: boolean;
  error?: string;
}

const initialState: EvaluationState = {
  evaluations: [],
  loading: false,
};

export const fetchEvaluations = createAsyncThunk(
  'evaluation/fetchEvaluations',
  async (_, { rejectWithValue }) => {
    try {
      return await evaluationService.getEvaluations();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.evaluations = [];
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations = action.payload.map((evalItem: any) => ({
          id: Number(evalItem.id), // Convertir a number
          evaluateeId: evalItem.evaluatee_id,
          title: evalItem.template_name || 'Sin título',
          evaluatorName: evalItem.evaluator_name,
          evaluateeName: evalItem.evaluatee_name,
          cycleName: evalItem.cycle_name,
          templateName: evalItem.template_name,
          status: evalItem.status,
          score: evalItem.score,
          comments: evalItem.comments,
          createdAt: evalItem.created_at,
          updatedAt: evalItem.updated_at,

          objective: evalItem.objective || '',
          dueDate: evalItem.due_date || '',
          templateQuestions: evalItem.template_questions || [], // Asegurar array
          responses:
            typeof evalItem.responses === 'string'
              ? JSON.parse(evalItem.responses)
              : evalItem.responses || {}, // Asegurar objeto
        }));
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default evaluationSlice.reducer;
