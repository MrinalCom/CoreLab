import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workoutService } from '../../services/workoutService';
import { WorkoutPlan } from '../../types';

interface WorkoutState {
  plans: WorkoutPlan[];
  activePlan: WorkoutPlan | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
}

const initialState: WorkoutState = {
  plans: [],
  activePlan: null,
  loading: false,
  generating: false,
  error: null,
};

export const fetchPlans = createAsyncThunk('workout/fetchPlans', async () => {
  return workoutService.getMyPlans();
});

export const generatePlan = createAsyncThunk('workout/generatePlan', async (data: {
  fitnessGoal: string;
  fitnessLevel: string;
  daysPerWeek: number;
  equipment?: string;
}) => {
  return workoutService.generatePlan(data);
});

export const deletePlan = createAsyncThunk('workout/deletePlan', async (planId: string) => {
  await workoutService.deletePlan(planId);
  return planId;
});

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setActivePlan: (state, action) => { state.activePlan = action.payload; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => { state.loading = true; })
      .addCase(fetchPlans.fulfilled, (state, action) => { state.loading = false; state.plans = action.payload; })
      .addCase(fetchPlans.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch'; })
      .addCase(generatePlan.pending, (state) => { state.generating = true; state.error = null; })
      .addCase(generatePlan.fulfilled, (state, action) => {
        state.generating = false;
        state.plans.unshift(action.payload);
        state.activePlan = action.payload;
      })
      .addCase(generatePlan.rejected, (state, action) => { state.generating = false; state.error = action.error.message || 'Generation failed'; })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter(p => p.id !== action.payload);
      });
  },
});

export const { setActivePlan, clearError } = workoutSlice.actions;
export default workoutSlice.reducer;
