import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trackingService } from '../../services/trackingService';
import { WorkoutSession, ProgressStats } from '../../types';

interface TrackingState {
  sessions: WorkoutSession[];
  activeSession: WorkoutSession | null;
  stats: ProgressStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrackingState = {
  sessions: [],
  activeSession: null,
  stats: null,
  loading: false,
  error: null,
};

export const fetchSessions = createAsyncThunk('tracking/fetchSessions', async () => {
  return trackingService.getSessions();
});

export const fetchStats = createAsyncThunk('tracking/fetchStats', async () => {
  return trackingService.getStats();
});

export const startSession = createAsyncThunk('tracking/startSession', async (data: {
  workoutPlanId?: string;
  workoutDayId?: string;
  workoutName?: string;
  sessionDate: string;
}) => {
  return trackingService.createSession(data);
});

export const completeSession = createAsyncThunk('tracking/completeSession', async ({
  sessionId, durationMinutes
}: { sessionId: string; durationMinutes: number }) => {
  return trackingService.completeSession(sessionId, durationMinutes);
});

export const logSet = createAsyncThunk('tracking/logSet', async ({
  sessionId, data
}: { sessionId: string; data: any }) => {
  return trackingService.logSet(sessionId, data);
});

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    setActiveSession: (state, action) => { state.activeSession = action.payload; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.fulfilled, (state, action) => { state.sessions = action.payload; })
      .addCase(fetchStats.fulfilled, (state, action) => { state.stats = action.payload; })
      .addCase(startSession.fulfilled, (state, action) => {
        state.activeSession = action.payload;
        state.sessions.unshift(action.payload);
      })
      .addCase(completeSession.fulfilled, (state, action) => {
        state.activeSession = null;
        const idx = state.sessions.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) state.sessions[idx] = action.payload;
      })
      .addCase(logSet.fulfilled, (state, action) => {
        state.activeSession = action.payload;
        const idx = state.sessions.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) state.sessions[idx] = action.payload;
      });
  },
});

export const { setActiveSession, clearError } = trackingSlice.actions;
export default trackingSlice.reducer;
