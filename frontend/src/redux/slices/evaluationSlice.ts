import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { evaluationService } from '../../services/evaluationService';

export interface Evaluation {
  id: string;
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
          id: evalItem.id.toString(),
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
        }));
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default evaluationSlice.reducer;
