import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface DashboardData {
  evaluacionesCompletadas: number;
  evaluacionesPendientes: number;
  promedioDesempeño: number;
}

interface DashboardState {
  data: DashboardData;
}

const initialState: DashboardState = {
  data: {
    evaluacionesCompletadas: 0,
    evaluacionesPendientes: 0,
    promedioDesempeño: 0,
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardData(state, action: PayloadAction<DashboardData>) {
      state.data = action.payload;
    },
  },
});

export const { setDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
