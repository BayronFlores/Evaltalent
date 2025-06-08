import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Evaluation {
  id: string;
  nombre: string;
  estado: string;
  resultado?: number;
}

interface EvaluationState {
  evaluations: Evaluation[];
}

const initialState: EvaluationState = {
  evaluations: [],
};

const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState,
  reducers: {
    setEvaluations(state, action: PayloadAction<Evaluation[]>) {
      state.evaluations = action.payload;
    },
    addEvaluation(state, action: PayloadAction<Evaluation>) {
      state.evaluations.push(action.payload);
    },
  },
});

export const { setEvaluations, addEvaluation } = evaluationSlice.actions;
export default evaluationSlice.reducer;
